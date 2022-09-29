# Overview

This script is provide to automate the uninstallation of the Landing Zone Accelerator on AWS solution.

PLEASE NOTE THIS IS HIGHLY DESTRUCTIVE ACTION.

RUNNING THIS PROCESS WIL DESTROY ALL COMPONENTS OF LANDING ZONE ACCELERATOR AND THE RESOURCES IT DEPLOYED SUCH AS SECURITY SERVICE CONFIGURAITON AND NETWORKING!

The CloudFormation script:

- creates a VPC
- deploys an EC2 instance
- installs all the required prerequisite packages
- runs the un-installation command for Landing Zone Accelerator on AWS

# Running the script

The CloudFormation script must be run from the management account and home region where Landing Zone Accelerator on AWS was deployed.

The script expects two inputs:

| **Parameter Name** | **Description** | **Default** |
|:---------------|:---------------|:---------------|
|LandingZoneAcceleratorStackName|The name you gave the Landing Zone Accelerator on AWS installation stack when you deployed the solution.|AWSAccelerator-InstallerStack|
|LatestAmiId|You are unlikely to need to change this unless you are developing updates to the script. This value is systems manager key used to look up tyhe latest AMI to be used when deploying the EC2 instance.|/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2|
|DeleteInstallerStack|If set to true this will remove the original installer stack you deployed to setup the Landing Zone Accelerator on AWS. If set to false the stack will remain, allowing you to re-run the AWSAccelerator-Installer pipeline to redeploy your landing zone configuration|true|

1. Sign in to the AWS Management Console of your organization’s management account and select the button to launch the Landing-zone-acceleartor-on-aws-cleanup AWS CloudFormation template. The template will create a nested cloudformation to setup the VPC. It will then deploy the EC2 instance and undertake the uninstallation. Whilst the uninstallation is running the CloudFormation template will remain in the **CREATE_IN_PROGRESS** stage.
2. To monitor the progress of the uninstallation open the CloudWatch console, from the left hand menu open the **Log groups** page and search for **landing-zone-accelerator-on-aws-cleanup**. *Note: it might take a few minutes for the log group to appear*
3. Select the latest instance ID log stream. Here you will see the progress of the uninstallation.

![Log stream uninstallation event example](images/cloudwatch-log-stream.png)

4. When the uninstallation is complete, the last line in the log group will read:

![Completion status example](images/completion.png)

*Note: AWSAccelerator-InstallerStack will be the name you gave to your installation stack when deploying Landing Zone Accelerator on AWS.

5. Once the uninstallation is complete the stack status will change to 

# Troublshooting

If the uninstallation fails you will recieve a message similar to the following in the log stream.

![Failure status example](images/failure.png)

You can use the logs to troubleshoot the issue and attempt any manual corrections based on the error messages.
To retry the uninstallation you can delete the cleanup stack and redeploy. It will attempt to pick up from where it failed.
*Note: to see the logs for the new run you will need to select the newly created log stream in CloudWatch logs.*

It is also possible to access the instance via Systems manager sessions manager. You can follow [these](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/session-manager.html) instructions to get access to the instance.
