/**
 *  Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as cdk from '@aws-cdk/core';

import { AccountsConfig, GlobalConfig, OrganizationConfig, IamConfig } from '@aws-accelerator/config';

export interface AcceleratorStackProps extends cdk.StackProps {
  accountIds: { [name: string]: string };
  accountsConfig: AccountsConfig;
  iamConfig: IamConfig;
  globalConfig: GlobalConfig;
  organizationConfig: OrganizationConfig;
}

export abstract class AcceleratorStack extends cdk.Stack {
  private props: AcceleratorStackProps;

  protected constructor(scope: cdk.Construct, id: string, props: AcceleratorStackProps) {
    super(scope, id, props);
    this.props = props;
  }

  protected isRegionExcluded(regions: string[]): boolean {
    if (regions?.includes(cdk.Stack.of(this).region)) {
      console.log(`${cdk.Stack.of(this).region} region explicitly excluded`);
      return true;
    }
    return false;
  }

  protected isAccountExcluded(accounts: string[]): boolean {
    for (const account of accounts ?? []) {
      const email = this.props.accountsConfig.getEmail(account);
      if (cdk.Stack.of(this).account === this.props.accountIds[email]) {
        console.log(`${account} account explicitly excluded`);
        return true;
      }
    }
    return false;
  }

  protected isAccountIncluded(accounts: string[]): boolean {
    for (const account of accounts ?? []) {
      const email = this.props.accountsConfig.getEmail(account);
      if (cdk.Stack.of(this).account === this.props.accountIds[email]) {
        console.log(`${account} region explicitly included`);
        return true;
      }
    }
    return false;
  }

  protected isOrganizationalUnitIncluded(organizationalUnits: string[]): boolean {
    // If root-ou is specified, return right away
    if (Object.values(organizationalUnits).includes('root-ou')) {
      return true;
    }

    for (const organizationalUnit of organizationalUnits ?? []) {
      const account = Object.entries(this.props.accountIds).find(item => item[1] === cdk.Stack.of(this).account);
      if (account) {
        // Check mandatory accounts
        let accountEntry = Object.entries(this.props.accountsConfig['mandatory-accounts']).find(
          account => account[1].email === account[0],
        );
        if (accountEntry?.[1]['organizational-unit'] === organizationalUnit) {
          console.log(`${organizationalUnit} organizational unit explicitly included`);
          return true;
        }
        // Check workload accounts
        accountEntry = Object.entries(this.props.accountsConfig['workload-accounts']).find(
          account => account[1].email === account[0],
        );
        if (accountEntry?.[1]['organizational-unit'] === organizationalUnit) {
          console.log(`${organizationalUnit} organizational unit explicitly included`);
          return true;
        }
      }
    }

    return false;
  }
}