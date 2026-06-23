const WORKFLOWS_DATA = {
  "compute/create-vm": {
    "id": "compute/create-vm",
    "title": "Create a Virtual Machine",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/Microsoft.VirtualMachine",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label=\"Subscription\"][role=\"button\"], [aria-label*=\"Subscription\"][aria-haspopup]",
        "fallbackSelector": "select[aria-label*=\"Subscription\"], [data-telemetryid=\"fxcSubs\"]",
        "title": "Choose your Subscription",
        "explanation": "A subscription is your billing container in Azure. All costs for this VM will be charged here. You can have multiple subscriptions — for example, one for production and one for dev/test."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label=\"Resource group\"][role=\"button\"], [aria-label*=\"Resource group\"][aria-haspopup]",
        "fallbackSelector": "select[aria-label*=\"Resource group\"], [data-telemetryid*=\"esourceGroup\"]",
        "title": "Select or create a Resource Group",
        "explanation": "A Resource Group is a logical folder for related Azure resources. Tip: keep all resources of one project in the same Resource Group — that way you can manage and delete them together."
      },
      {
        "id": "vm-name",
        "selector": "input[aria-label=\"Virtual machine name\"], input[id*=\"virtualMachineName\"]",
        "fallbackSelector": "input[placeholder*=\"machine name\"], input[name*=\"machineName\"]",
        "title": "Give the VM a name",
        "explanation": "The VM name also becomes the OS hostname. Use a consistent naming convention, e.g. 'prod-web-01' or 'dev-db-01'. Maximum 15 characters for Windows, 64 for Linux."
      },
      {
        "id": "region",
        "selector": "[aria-label=\"Region\"][role=\"button\"], [aria-label*=\"Region\"][aria-haspopup]",
        "fallbackSelector": "select[aria-label*=\"Region\"], [data-telemetryid*=\"egion\"]",
        "title": "Choose a region",
        "explanation": "The region determines where your VM physically runs. Choose a region close to your users for low latency. West Europe (Amsterdam) and North Europe (Dublin) are popular choices in Europe."
      },
      {
        "id": "image",
        "selector": "[aria-label=\"Image\"][role=\"button\"], [aria-label*=\"See all images\"]",
        "fallbackSelector": "[data-telemetryid*=\"mage\"], button[aria-label*=\"image\"]",
        "title": "Choose an Image (OS)",
        "explanation": "The image defines the operating system of your VM. Windows Server is suitable for .NET workloads; Ubuntu or RHEL for Linux. Marketplace images may include additional licensing costs."
      },
      {
        "id": "size",
        "selector": "[aria-label=\"Size\"][role=\"button\"], button[aria-label*=\"VM size\"], [aria-label*=\"See all sizes\"]",
        "fallbackSelector": "[data-telemetryid*=\"ize\"], button[aria-label*=\"size\"]",
        "title": "Choose a VM size",
        "explanation": "The size determines the number of vCPUs, RAM, and the price. B-series are cheap for dev/test. D-series are general purpose for production. Start small — you can always scale up later."
      },
      {
        "id": "username",
        "selector": "input[aria-label=\"Username\"], input[id*=\"adminUsername\"], input[name*=\"dminUsername\"]",
        "fallbackSelector": "input[placeholder*=\"Username\"], input[autocomplete*=\"username\"]",
        "title": "Set the admin username",
        "explanation": "This is the username for the first administrator account on the VM. Avoid common names like 'admin' or 'administrator' — this reduces the risk of brute-force attacks."
      },
      {
        "id": "auth-type",
        "selector": "[aria-label=\"Authentication type\"][role=\"radiogroup\"], fieldset[aria-label*=\"Authentication\"]",
        "fallbackSelector": "input[type=\"radio\"][value*=\"Password\"], input[type=\"radio\"][value*=\"SSH\"]",
        "title": "Choose the authentication type",
        "explanation": "SSH public key is more secure than a password for Linux VMs. For Windows, Remote Desktop Password is the default. Prefer SSH keys and store passwords in Azure Key Vault."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label=\"Review + create\"], a[aria-label=\"Review + create\"]",
        "fallbackSelector": "button[data-telemetryid*=\"eview\"], li[aria-label*=\"Review + create\"]",
        "title": "Click Review + create",
        "explanation": "Azure first validates your settings. Once everything is green, click 'Create'. Deployment typically takes 2-5 minutes. Monitor progress via the Notifications bell in the top right corner."
      }
    ],
    "category": "Compute",
    "tags": [
      "vm",
      "virtual machine",
      "iaas",
      "server",
      "compute"
    ]
  },
  "compute/create-vmss": {
    "id": "compute/create-vmss",
    "title": "Create a VM Scale Set",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/Microsoft.VMSSWizard",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label='Subscription']",
        "fallbackSelector": "[data-telemetryid='SubscriptionDropDown']",
        "title": "Choose your Subscription",
        "explanation": "A VM Scale Set (VMSS) bills per VM instance that runs. With autoscaling, costs vary dynamically — set budget alerts on the subscription to avoid surprises."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label='Resource group']",
        "fallbackSelector": "[name='resourceGroup']",
        "title": "Select or create a Resource Group",
        "explanation": "Place the Scale Set in the same Resource Group as the load balancer and VNet it will use. This keeps the entire application stack manageable as a unit."
      },
      {
        "id": "vmss-name",
        "selector": "[aria-label='Virtual machine scale set name']",
        "fallbackSelector": "[name='vmssName']",
        "title": "Give the Scale Set a name",
        "explanation": "Each VM instance in the set gets a name based on this prefix, e.g. 'webscaleset000000', 'webscaleset000001'. Keep the name short to leave room for the instance suffix."
      },
      {
        "id": "region",
        "selector": "[aria-label='Region']",
        "fallbackSelector": "[data-telemetryid='RegionDropDown']",
        "title": "Choose a region",
        "explanation": "Choose the same region as your load balancer and backend services. For higher availability, use Availability Zones — this spreads instances across physically separate datacenters within the region."
      },
      {
        "id": "orchestration-mode",
        "selector": "[aria-label='Orchestration mode']",
        "fallbackSelector": "[data-telemetryid='OrchestrationMode']",
        "title": "Choose the Orchestration mode",
        "explanation": "Flexible: each VM is a full Azure VM with its own NIC — best for most workloads and supports mixing VM sizes. Uniform: identical VMs managed as a group — suited for stateless, high-scale scenarios like web frontends."
      },
      {
        "id": "image",
        "selector": "[aria-label='Image']",
        "fallbackSelector": "[data-telemetryid='ImageDropDown']",
        "title": "Choose an Image",
        "explanation": "All VMs in the Scale Set use the same base image. Choose a consistent image that includes your application or use Azure VM Extensions / cloud-init to configure VMs on startup."
      },
      {
        "id": "scaling",
        "selector": "[aria-label='Scaling']",
        "fallbackSelector": "[data-telemetryid='ScalingPolicy']",
        "title": "Configure scaling",
        "explanation": "Manual: you control the instance count. Autoscaling: Azure adds or removes instances based on CPU, memory, or custom metrics. Set a minimum and maximum to control costs and ensure availability."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label='Review + create']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndCreate']",
        "title": "Click Review + create",
        "explanation": "After deployment, attach a Load Balancer or Application Gateway to distribute traffic across instances. Configure the health probe so Azure automatically replaces unhealthy instances."
      }
    ],
    "category": "Compute",
    "tags": [
      "vmss",
      "scale set",
      "autoscale",
      "compute"
    ]
  },
  "networking/create-vnet": {
    "id": "networking/create-vnet",
    "title": "Create a Virtual Network",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/Microsoft.VirtualNetwork",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label='Subscription']",
        "fallbackSelector": "[data-telemetryid='SubscriptionDropDown']",
        "title": "Choose your Subscription",
        "explanation": "A VNet itself is free — you only pay for data transfer between regions and for certain gateway services. Choose the subscription that matches your project's billing boundary."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label='Resource group']",
        "fallbackSelector": "[name='resourceGroup']",
        "title": "Select or create a Resource Group",
        "explanation": "Place the VNet in the same Resource Group as the resources that will use it. A VNet spans a single region but can serve multiple resource groups via peering."
      },
      {
        "id": "vnet-name",
        "selector": "[aria-label='Name']",
        "fallbackSelector": "[name='virtualNetworkName']",
        "title": "Give the VNet a name",
        "explanation": "Use a clear, descriptive name such as 'vnet-prod-westeurope' or 'vnet-dev'. Good naming saves confusion when you have multiple VNets across environments and regions."
      },
      {
        "id": "region",
        "selector": "[aria-label='Region']",
        "fallbackSelector": "[data-telemetryid='RegionDropDown']",
        "title": "Choose a region",
        "explanation": "A VNet always exists within a single Azure region. Resources within the same VNet communicate for free. To connect multiple regions, use VNet Peering or a VPN Gateway."
      },
      {
        "id": "address-space",
        "selector": "[aria-label='IPv4 address space']",
        "fallbackSelector": "[name='addressSpace']",
        "title": "Set the address space",
        "explanation": "The address space is the IP range for your entire VNet, in CIDR notation. For example, 10.0.0.0/16 gives you 65,536 addresses. Use private ranges (10.x, 172.16-31.x, 192.168.x) and leave room for future subnets."
      },
      {
        "id": "subnet-name",
        "selector": "[aria-label='Subnet name']",
        "fallbackSelector": "[name='subnetName']",
        "title": "Configure the first subnet",
        "explanation": "A subnet is a segment within your VNet where you place resources. Use separate subnets for different tiers, e.g. 'subnet-web' and 'subnet-db', to control traffic flow with NSGs."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label='Review + create']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndCreate']",
        "title": "Click Review + create",
        "explanation": "VNet creation takes less than 30 seconds. Once created, you can immediately place resources into it or add more subnets under the VNet's Subnets blade."
      }
    ],
    "category": "Networking",
    "tags": [
      "vnet",
      "virtual network",
      "networking"
    ]
  },
  "networking/create-nsg": {
    "id": "networking/create-nsg",
    "title": "Create a Network Security Group",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/Microsoft.Network/networkSecurityGroups",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label='Subscription']",
        "fallbackSelector": "[data-telemetryid='SubscriptionDropDown']",
        "title": "Choose your Subscription",
        "explanation": "An NSG is a free resource — you pay nothing for the NSG itself, only for the traffic that flows through it."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label='Resource group']",
        "fallbackSelector": "[name='resourceGroup']",
        "title": "Select or create a Resource Group",
        "explanation": "Place the NSG in the same Resource Group as the subnet or network interface it will be associated with. This keeps related resources organized together."
      },
      {
        "id": "nsg-name",
        "selector": "[aria-label='Name']",
        "fallbackSelector": "[name='networkSecurityGroupName']",
        "title": "Give the NSG a name",
        "explanation": "Use a descriptive name like 'nsg-web-prod' or 'nsg-db-dev'. An NSG can be associated with multiple subnets or NICs, so the name should reflect the function, not the location."
      },
      {
        "id": "region",
        "selector": "[aria-label='Region']",
        "fallbackSelector": "[data-telemetryid='RegionDropDown']",
        "title": "Choose a region",
        "explanation": "An NSG must be in the same region as the resources it protects. An NSG in West Europe cannot be directly associated with a subnet in East US."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label='Review + create']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndCreate']",
        "title": "Click Review + create",
        "explanation": "After creation, add inbound and outbound rules. By default, an NSG blocks all inbound internet traffic and allows all internal VNet traffic. Add only the rules you actually need (principle of least privilege)."
      }
    ],
    "category": "Networking",
    "tags": [
      "nsg",
      "firewall",
      "security group",
      "network",
      "rules"
    ]
  },
  "networking/create-load-balancer": {
    "id": "networking/create-load-balancer",
    "title": "Create a Load Balancer",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/Microsoft.LoadBalancer-ARM",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label='Subscription']",
        "fallbackSelector": "[data-telemetryid='SubscriptionDropDown']",
        "title": "Choose your Subscription",
        "explanation": "A Standard Load Balancer is billed per rule and per GB of data processed. The Basic SKU is free but lacks availability zones and SLA. Always use Standard for production workloads."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label='Resource group']",
        "fallbackSelector": "[name='resourceGroup']",
        "title": "Select or create a Resource Group",
        "explanation": "Place the Load Balancer in the same Resource Group as the VMs or Scale Set it will distribute traffic to. This simplifies management and keeps network resources co-located."
      },
      {
        "id": "lb-name",
        "selector": "[aria-label='Name']",
        "fallbackSelector": "[name='loadBalancerName']",
        "title": "Give the Load Balancer a name",
        "explanation": "Use a descriptive name like 'lb-web-prod' or 'lb-api-westeurope'. The name should reflect the workload it fronts, not the backend VMs (those may change)."
      },
      {
        "id": "region",
        "selector": "[aria-label='Region']",
        "fallbackSelector": "[data-telemetryid='RegionDropDown']",
        "title": "Choose a region",
        "explanation": "The Load Balancer must be in the same region as the backend VMs. An Azure Load Balancer is a regional service — for global load balancing use Azure Front Door or Traffic Manager."
      },
      {
        "id": "sku",
        "selector": "[aria-label='SKU']",
        "fallbackSelector": "[data-telemetryid='SkuSelector']",
        "title": "Choose the SKU",
        "explanation": "Standard SKU: supports Availability Zones, outbound rules, HTTPS health probes, and comes with an SLA. Basic SKU: free but no zone support and no SLA. Always choose Standard for production."
      },
      {
        "id": "type",
        "selector": "[aria-label='Type']",
        "fallbackSelector": "[data-telemetryid='TypeSelector']",
        "title": "Choose Public or Internal",
        "explanation": "Public: distributes internet-facing traffic (needs a Public IP). Internal: distributes traffic within a VNet, e.g. between an API layer and a database tier. Never expose internal services publicly."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label='Review + create']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndCreate']",
        "title": "Click Review + create",
        "explanation": "After creation, configure: (1) a Frontend IP, (2) a Backend Pool with your VMs, (3) a Health Probe, and (4) Load Balancing Rules. All four are required before traffic flows."
      }
    ],
    "category": "Networking",
    "tags": [
      "load balancer",
      "lb",
      "traffic",
      "balancing"
    ]
  },
  "storage/create-storage-account": {
    "id": "storage/create-storage-account",
    "title": "Create a Storage Account",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/Microsoft.StorageAccount-ARM",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label='Subscription']",
        "fallbackSelector": "[data-telemetryid='SubscriptionDropDown']",
        "title": "Choose your Subscription",
        "explanation": "Storage Account costs depend on the amount of data stored, the redundancy level (LRS/GRS), and the number of transactions. Choose the right subscription for cost accountability."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label='Resource group']",
        "fallbackSelector": "[name='resourceGroup']",
        "title": "Select or create a Resource Group",
        "explanation": "Place the Storage Account in the Resource Group of the application that uses it. This keeps costs and management clear per project."
      },
      {
        "id": "storage-account-name",
        "selector": "[aria-label='Storage account name']",
        "fallbackSelector": "[name='storageAccountName']",
        "title": "Give the Storage Account a name",
        "explanation": "The name must be globally unique in Azure (3-24 characters, lowercase letters and digits only). This name becomes part of the URL: accountname.blob.core.windows.net. Choose carefully — the name cannot be changed after creation."
      },
      {
        "id": "region",
        "selector": "[aria-label='Region']",
        "fallbackSelector": "[data-telemetryid='RegionDropDown']",
        "title": "Choose a region",
        "explanation": "Choose the same region as the resources that will use this storage account to minimize latency and avoid egress costs. Data transfer within the same region is free; cross-region transfer is billed."
      },
      {
        "id": "performance",
        "selector": "[aria-label='Performance']",
        "fallbackSelector": "[data-telemetryid='Performance']",
        "title": "Choose the Performance tier",
        "explanation": "Standard: HDD-based, cheap, suitable for backups and archiving. Premium: SSD-based, low latency, for databases and demanding applications. Premium is significantly more expensive."
      },
      {
        "id": "redundancy",
        "selector": "[aria-label='Redundancy']",
        "fallbackSelector": "[data-telemetryid='Redundancy']",
        "title": "Choose the Redundancy level",
        "explanation": "LRS (Locally Redundant): 3 copies in 1 datacenter — cheapest. ZRS: spread across 3 availability zones in 1 region. GRS: 6 copies in 2 regions — most expensive but highest availability. Choose based on your SLA requirements."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label='Review + create']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndCreate']",
        "title": "Click Review + create",
        "explanation": "After creation, find access keys and connection strings under 'Security + networking → Access keys'. Where possible, use Managed Identities instead of access keys for applications — it's more secure and requires no secret rotation."
      }
    ],
    "category": "Storage",
    "tags": [
      "storage",
      "account",
      "blob",
      "files",
      "queues",
      "tables"
    ]
  },
  "storage/create-blob-container": {
    "id": "storage/create-blob-container",
    "title": "Create a Blob Container",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/",
    "steps": [
      {
        "id": "navigate-storage",
        "selector": "[aria-label='Storage accounts']",
        "fallbackSelector": "[data-telemetryid='StorageAccounts']",
        "title": "Open Storage accounts",
        "explanation": "A Blob Container lives inside a Storage Account. You must have a Storage Account before creating a container. If you don't have one yet, use the 'Create a Storage Account' workflow first."
      },
      {
        "id": "select-account",
        "selector": ".fxs-blade-firstblade .azc-grid-row",
        "fallbackSelector": "[role='row']",
        "title": "Select your Storage Account",
        "explanation": "Click the Storage Account where you want to create the container. All containers within one account share the same access keys and redundancy settings."
      },
      {
        "id": "containers-menu",
        "selector": "[aria-label='Containers']",
        "fallbackSelector": "[data-telemetryid='Containers']",
        "title": "Open Containers",
        "explanation": "In the left menu of the Storage Account, click 'Containers' under the Data storage section. This shows all existing containers and lets you create new ones."
      },
      {
        "id": "new-container",
        "selector": "button[aria-label='+ Container']",
        "fallbackSelector": "button[data-telemetryid='AddContainer']",
        "title": "Click + Container",
        "explanation": "This opens the new container panel. A storage account can hold unlimited containers, and each container can hold unlimited blobs (files)."
      },
      {
        "id": "container-name",
        "selector": "[aria-label='Name']",
        "fallbackSelector": "[name='containerName']",
        "title": "Give the container a name",
        "explanation": "Container names must be lowercase, 3-63 characters, and can contain letters, digits, and hyphens. The name becomes part of the URL: accountname.blob.core.windows.net/containername."
      },
      {
        "id": "access-level",
        "selector": "[aria-label='Public access level']",
        "fallbackSelector": "[data-telemetryid='PublicAccessLevel']",
        "title": "Set the Public access level",
        "explanation": "Private: no anonymous access (recommended for most cases). Blob: anyone can read individual blobs if they know the URL — useful for static assets like images. Container: anyone can list and read all blobs. Never set Container-level access for sensitive data."
      },
      {
        "id": "create",
        "selector": "button[aria-label='Create']",
        "fallbackSelector": "button[data-telemetryid='CreateContainer']",
        "title": "Click Create",
        "explanation": "The container is created instantly. You can now upload blobs via the portal, Azure Storage Explorer, AzCopy, or the Azure SDK. Use Lifecycle Management policies to automatically tier or delete old blobs."
      }
    ],
    "category": "Storage",
    "tags": [
      "blob",
      "container",
      "storage",
      "object storage"
    ]
  },
  "app-services/create-app-service": {
    "id": "app-services/create-app-service",
    "title": "Create an App Service",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/Microsoft.WebSite",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label='Subscription']",
        "fallbackSelector": "[data-telemetryid='SubscriptionDropDown']",
        "title": "Choose your Subscription",
        "explanation": "App Service costs are determined by the underlying App Service Plan (compute). You can run multiple App Services on one plan to share costs."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label='Resource group']",
        "fallbackSelector": "[name='resourceGroup']",
        "title": "Select or create a Resource Group",
        "explanation": "Place the App Service in your project's Resource Group. If you also use a database, storage, or VNet, keep them all in the same Resource Group for clarity and joint management."
      },
      {
        "id": "app-name",
        "selector": "[aria-label='Name']",
        "fallbackSelector": "[name='siteName']",
        "title": "Give the App Service a name",
        "explanation": "The name determines the default URL: yourapp.azurewebsites.net. The name must be globally unique in Azure. You can attach a custom domain later via 'Custom domains' if you don't want to use the default URL."
      },
      {
        "id": "publish-type",
        "selector": "[aria-label='Publish']",
        "fallbackSelector": "[data-telemetryid='PublishType']",
        "title": "Choose the publish type",
        "explanation": "Code: deploy from Git, ZIP, or a CI/CD pipeline. Container: deploy a Docker image from a container registry. Choose Code for most web apps and APIs."
      },
      {
        "id": "runtime",
        "selector": "[aria-label='Runtime stack']",
        "fallbackSelector": "[data-telemetryid='RuntimeStack']",
        "title": "Choose the runtime stack",
        "explanation": "Choose the language and version of your application (.NET, Node.js, Python, Java, PHP). Always pick the latest LTS version unless you have a specific requirement. Older versions no longer receive security updates."
      },
      {
        "id": "region",
        "selector": "[aria-label='Region']",
        "fallbackSelector": "[data-telemetryid='RegionDropDown']",
        "title": "Choose a region",
        "explanation": "Choose a region close to your users for low latency. If your database is in West Europe, place the App Service there too to minimize network latency between app and database."
      },
      {
        "id": "app-service-plan",
        "selector": "[aria-label='App Service Plan']",
        "fallbackSelector": "[data-telemetryid='AppServicePlan']",
        "title": "Select or create an App Service Plan",
        "explanation": "The App Service Plan defines the compute resources (CPU, RAM) and the price. Free/Shared: for dev/test with limited features. Basic/Standard: for production with autoscaling. Premium: for high performance and isolation. Multiple apps can share one plan."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label='Review + create']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndCreate']",
        "title": "Click Review + create",
        "explanation": "After creation, deploy your code via GitHub Actions, Azure DevOps, or local Git. Go to 'Deployment Center' for the easiest CI/CD setup. Your app is immediately reachable at yourapp.azurewebsites.net."
      }
    ],
    "category": "App Services",
    "tags": [
      "app service",
      "web app",
      "webapp",
      "paas",
      "website",
      "api"
    ]
  },
  "app-services/create-app-service-plan": {
    "id": "app-services/create-app-service-plan",
    "title": "Create an App Service Plan",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/Microsoft.AppServicePlanCreate",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label='Subscription']",
        "fallbackSelector": "[data-telemetryid='SubscriptionDropDown']",
        "title": "Choose your Subscription",
        "explanation": "The App Service Plan is what you actually pay for — not the individual App Services. One plan can host multiple App Services, so the cost is shared across all apps running on it."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label='Resource group']",
        "fallbackSelector": "[name='resourceGroup']",
        "title": "Select or create a Resource Group",
        "explanation": "Place the App Service Plan in the same Resource Group as the App Services that will use it. If you plan to share a plan across multiple projects, place it in a shared infrastructure Resource Group."
      },
      {
        "id": "plan-name",
        "selector": "[aria-label='Name']",
        "fallbackSelector": "[name='appServicePlanName']",
        "title": "Give the plan a name",
        "explanation": "Use a name that reflects the size and environment, e.g. 'asp-prod-standard' or 'asp-dev-free'. You may host many apps on this plan, so the name should describe the plan, not a single app."
      },
      {
        "id": "os",
        "selector": "[aria-label='Operating System']",
        "fallbackSelector": "[data-telemetryid='OperatingSystem']",
        "title": "Choose the Operating System",
        "explanation": "Windows: supports .NET Framework, .NET Core, ASP.NET, PHP, Node.js. Linux: supports .NET Core, Node.js, Python, Ruby, PHP, Java, custom containers. Linux plans are generally cheaper. You cannot mix OS types on a single plan."
      },
      {
        "id": "region",
        "selector": "[aria-label='Region']",
        "fallbackSelector": "[data-telemetryid='RegionDropDown']",
        "title": "Choose a region",
        "explanation": "Choose the same region as your database and other backend services. All App Services on this plan will run in this region. You cannot move a plan to another region later."
      },
      {
        "id": "pricing-tier",
        "selector": "[aria-label='Pricing plan']",
        "fallbackSelector": "[data-telemetryid='PricingTier']",
        "title": "Choose the Pricing tier",
        "explanation": "Free/Shared: dev/test only, limited CPU minutes, no custom domains. Basic: production-ready, manual scaling. Standard: autoscaling, staging slots, daily backups. Premium: higher performance, more slots, VNet integration. Choose the tier that matches your SLA needs."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label='Review + create']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndCreate']",
        "title": "Click Review + create",
        "explanation": "After creation, you can create App Services on this plan or move existing App Services to it. You can scale the plan up (bigger VM) or out (more instances) at any time without downtime."
      }
    ],
    "category": "App Services",
    "tags": [
      "app service plan",
      "hosting plan",
      "paas",
      "compute plan"
    ]
  },
  "containers/create-aks": {
    "id": "containers/create-aks",
    "title": "Create an AKS Cluster",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/microsoft.aks",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label='Subscription']",
        "fallbackSelector": "[data-telemetryid='SubscriptionDropDown']",
        "title": "Choose your Subscription",
        "explanation": "AKS costs consist of the worker node VMs (you pay for the compute) and optionally the Uptime SLA for the control plane. The control plane itself is free, but without the SLA there is no availability guarantee."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label='Resource group']",
        "fallbackSelector": "[name='resourceGroup']",
        "title": "Select or create a Resource Group",
        "explanation": "AKS automatically creates a second Resource Group for the underlying infrastructure (nodes, load balancers, disks). It is named 'MC_<rg>_<cluster>_<region>' by default and is managed by Azure — never delete it manually."
      },
      {
        "id": "cluster-name",
        "selector": "[aria-label='Kubernetes cluster name']",
        "fallbackSelector": "[name='clusterName']",
        "title": "Give the cluster a name",
        "explanation": "Use a descriptive name like 'aks-prod-westeurope'. The name also becomes the context name in your kubeconfig. Choose a name that indicates the environment and region — you may have multiple clusters later."
      },
      {
        "id": "region",
        "selector": "[aria-label='Region']",
        "fallbackSelector": "[data-telemetryid='RegionDropDown']",
        "title": "Choose a region",
        "explanation": "Not all Kubernetes versions are available in every region. West Europe and North Europe are the most complete regions in Europe for AKS features. Choose the same region as your Container Registry (ACR) for free image pulls."
      },
      {
        "id": "k8s-version",
        "selector": "[aria-label='Kubernetes version']",
        "fallbackSelector": "[data-telemetryid='KubernetesVersion']",
        "title": "Choose the Kubernetes version",
        "explanation": "Choose the latest stable version unless you have specific version requirements. AKS supports each version for approximately 1 year. Plan upgrades — on an EOL version you can no longer request support or upgrade via the portal."
      },
      {
        "id": "node-size",
        "selector": "[aria-label='Node size']",
        "fallbackSelector": "button[data-telemetryid='NodeSize']",
        "title": "Choose the node size",
        "explanation": "Node size determines how many pods can run per node (based on CPU and RAM). Standard D-series are a good starting point. Use multiple smaller nodes instead of one large one — this gives better failover when a node crashes."
      },
      {
        "id": "node-count",
        "selector": "[aria-label='Node count']",
        "fallbackSelector": "[name='agentCount']",
        "title": "Set the node count",
        "explanation": "Minimum 3 nodes for production (so the control plane maintains quorum during updates). With Cluster Autoscaler you can let Azure scale this automatically. Fewer than 3 nodes is fine for dev/test."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label='Review + create']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndCreate']",
        "title": "Click Review + create",
        "explanation": "AKS deployment takes 5-15 minutes. Afterwards, download the kubeconfig with: az aks get-credentials --resource-group <rg> --name <cluster>. You can then immediately use kubectl or Helm."
      }
    ],
    "category": "Containers",
    "tags": [
      "aks",
      "kubernetes",
      "k8s",
      "cluster",
      "containers"
    ]
  },
  "containers/create-container-instance": {
    "id": "containers/create-container-instance",
    "title": "Create a Container Instance",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/Microsoft.ContainerInstancesWizard",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label='Subscription']",
        "fallbackSelector": "[data-telemetryid='SubscriptionDropDown']",
        "title": "Choose your Subscription",
        "explanation": "Azure Container Instances (ACI) bills per second of CPU and memory used. It is ideal for short-lived or event-driven workloads — you pay nothing when the container is stopped."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label='Resource group']",
        "fallbackSelector": "[name='resourceGroup']",
        "title": "Select or create a Resource Group",
        "explanation": "Place the container instance in the Resource Group of the project it belongs to. ACI instances are ephemeral by nature — the Resource Group makes it easy to clean up all related resources."
      },
      {
        "id": "container-name",
        "selector": "[aria-label='Container name']",
        "fallbackSelector": "[name='containerName']",
        "title": "Give the container a name",
        "explanation": "This name identifies the container instance in Azure. It becomes part of the DNS name if you enable a public IP. Use lowercase letters, digits, and hyphens."
      },
      {
        "id": "region",
        "selector": "[aria-label='Region']",
        "fallbackSelector": "[data-telemetryid='RegionDropDown']",
        "title": "Choose a region",
        "explanation": "Choose the region closest to your users or backend services. Not all container sizes and GPU options are available in every region. West Europe and East US have the broadest availability."
      },
      {
        "id": "image-source",
        "selector": "[aria-label='Image source']",
        "fallbackSelector": "[data-telemetryid='ImageSource']",
        "title": "Choose the image source",
        "explanation": "Quickstart images: Microsoft sample images for testing. Docker Hub: public images like 'nginx' or 'redis'. Azure Container Registry (ACR): your own private images. Other registry: any private registry with credentials."
      },
      {
        "id": "image",
        "selector": "[aria-label='Image']",
        "fallbackSelector": "[name='image']",
        "title": "Specify the container image",
        "explanation": "Enter the full image reference, e.g. 'mcr.microsoft.com/azuredocs/aci-helloworld' or 'myregistry.azurecr.io/myapp:v1.2'. Always pin to a specific tag — avoid 'latest' in production as it changes without warning."
      },
      {
        "id": "cpu-memory",
        "selector": "[aria-label='Number of cores']",
        "fallbackSelector": "[name='cpu']",
        "title": "Set CPU and memory",
        "explanation": "Start with the minimum your app needs and scale up if you see performance issues. Each vCPU comes with up to 3.5 GB RAM. ACI does not autoscale — if you need scaling, use AKS or Azure Container Apps instead."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label='Review + create']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndCreate']",
        "title": "Click Review + create",
        "explanation": "The container starts within seconds. View logs and connect to the container shell via the portal under 'Containers → Logs' and 'Connect'. To persist data across restarts, mount an Azure Files share as a volume."
      }
    ],
    "category": "Containers",
    "tags": [
      "aci",
      "container instance",
      "docker",
      "container"
    ]
  },
  "containers/create-container-registry": {
    "id": "containers/create-container-registry",
    "title": "Create a Container Registry",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/Microsoft.ContainerRegistry",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label='Subscription']",
        "fallbackSelector": "[data-telemetryid='SubscriptionDropDown']",
        "title": "Choose your Subscription",
        "explanation": "Azure Container Registry (ACR) is billed per storage used and per operation. Image pulls from AKS or ACI in the same region are free — cross-region pulls incur egress costs."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label='Resource group']",
        "fallbackSelector": "[name='resourceGroup']",
        "title": "Select or create a Resource Group",
        "explanation": "Place the registry in a shared infrastructure Resource Group, not in a single application's Resource Group. Multiple teams and services typically share one registry."
      },
      {
        "id": "registry-name",
        "selector": "[aria-label='Registry name']",
        "fallbackSelector": "[name='registryName']",
        "title": "Give the registry a name",
        "explanation": "The name must be globally unique (5-50 characters, alphanumeric only). It becomes the login server URL: registryname.azurecr.io. Choose a name that reflects your organization, e.g. 'mycompanyprod'."
      },
      {
        "id": "region",
        "selector": "[aria-label='Location']",
        "fallbackSelector": "[data-telemetryid='RegionDropDown']",
        "title": "Choose a region",
        "explanation": "Place the registry in the same region as the AKS or ACI workloads that pull images from it. Same-region pulls are free and faster. For global workloads, use Geo-replication (Premium tier)."
      },
      {
        "id": "sku",
        "selector": "[aria-label='SKU']",
        "fallbackSelector": "[data-telemetryid='SkuSelector']",
        "title": "Choose the SKU",
        "explanation": "Basic: dev/test, 10 GB storage, no geo-replication. Standard: production, 100 GB storage, webhooks. Premium: geo-replication, private link, 500 GB storage, content trust. Use Standard for most production scenarios; Premium for multi-region deployments."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label='Review + create']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndCreate']",
        "title": "Click Review + create",
        "explanation": "After creation, grant your AKS cluster or CI/CD pipeline the AcrPull role on this registry — avoid using admin credentials in pipelines. Use 'az acr login' locally or managed identity in Azure-hosted runners."
      }
    ],
    "category": "Containers",
    "tags": [
      "acr",
      "container registry",
      "docker",
      "images",
      "registry"
    ]
  },
  "identity/create-app-registration": {
    "id": "identity/create-app-registration",
    "title": "Create an App Registration",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/CreateApplicationBlade",
    "steps": [
      {
        "id": "app-name",
        "selector": "[aria-label='Name']",
        "fallbackSelector": "[placeholder='Enter a display name']",
        "title": "Give the application a name",
        "explanation": "This is the name users see on the consent screen when signing in. Choose a clear, descriptive name such as 'MyApp Backend API' or 'Azure Clippy Extension'."
      },
      {
        "id": "supported-account-types",
        "selector": "[aria-label='Supported account types']",
        "fallbackSelector": "#supported-account-types",
        "title": "Choose who can sign in",
        "explanation": "Single tenant: only users from your own Entra ID tenant. Multitenant: users from other organizations too. Personal Microsoft accounts: for consumer apps (Xbox, Outlook.com). Choose the most restrictive option that fits your use case."
      },
      {
        "id": "redirect-uri",
        "selector": "[aria-label='Redirect URI']",
        "fallbackSelector": "[placeholder*='redirect']",
        "title": "Set the Redirect URI (optional)",
        "explanation": "The Redirect URI is the URL Azure redirects to after successful authentication. For web apps, e.g. 'https://myapp.com/auth/callback'. For APIs without interactive login you can leave this empty."
      },
      {
        "id": "register",
        "selector": "button[aria-label='Register']",
        "fallbackSelector": "button[data-telemetryid='RegisterButton']",
        "title": "Click Register",
        "explanation": "After registration you get an Application (client) ID and a Tenant ID — you need these in your application code. Next, go to 'Certificates & secrets' to create a client secret for server-to-server authentication."
      }
    ],
    "category": "Identity",
    "tags": [
      "app registration",
      "aad",
      "entra",
      "oauth",
      "service principal",
      "client id"
    ]
  },
  "identity/assign-rbac": {
    "id": "identity/assign-rbac",
    "title": "Assign an RBAC Role",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/",
    "steps": [
      {
        "id": "navigate-resource",
        "selector": "[aria-label='Search resources, services, and docs']",
        "fallbackSelector": "#searchbox",
        "title": "Navigate to the resource or scope",
        "explanation": "RBAC roles are assigned at a specific scope: Management Group, Subscription, Resource Group, or individual resource. The lower the scope, the more targeted the permission. Always assign at the lowest scope needed (principle of least privilege)."
      },
      {
        "id": "iam-menu",
        "selector": "[aria-label='Access control (IAM)']",
        "fallbackSelector": "[data-telemetryid='AccessControl']",
        "title": "Open Access control (IAM)",
        "explanation": "Every Azure resource has an 'Access control (IAM)' blade in the left menu. This is where you manage who has access and what they can do. It shows all current role assignments at this scope."
      },
      {
        "id": "add-role",
        "selector": "button[aria-label='Add role assignment']",
        "fallbackSelector": "button[data-telemetryid='AddRoleAssignment']",
        "title": "Click Add role assignment",
        "explanation": "This opens the role assignment wizard. You will select a role, then choose who gets it. You can add multiple assignments — one per role and per user/group/service principal."
      },
      {
        "id": "role",
        "selector": "[aria-label='Role']",
        "fallbackSelector": "[data-telemetryid='RoleSelector']",
        "title": "Choose a role",
        "explanation": "Common roles: Owner (full access + can assign roles), Contributor (full access, cannot assign roles), Reader (read-only). Use built-in roles where possible. Custom roles are available but harder to maintain. For specific services, use service-scoped roles like 'Storage Blob Data Contributor'."
      },
      {
        "id": "members",
        "selector": "[aria-label='Members']",
        "fallbackSelector": "[data-telemetryid='MembersTab']",
        "title": "Go to the Members tab",
        "explanation": "Here you select who receives the role. You can assign to: a User, a Group (preferred — easier to manage at scale), a Service Principal (for applications), or a Managed Identity (for Azure resources that need to access other resources)."
      },
      {
        "id": "select-members",
        "selector": "button[aria-label='Select members']",
        "fallbackSelector": "button[data-telemetryid='SelectMembers']",
        "title": "Click Select members",
        "explanation": "Search by name or email address. For applications, search by the App Registration name. For Azure services (VMs, Functions), search by the resource name to find its managed identity."
      },
      {
        "id": "review-assign",
        "selector": "button[aria-label='Review + assign']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndAssign']",
        "title": "Click Review + assign",
        "explanation": "Role assignments take effect within a few minutes. If you assigned to a Group, all current and future group members inherit the role. To audit all assignments across your subscription, use 'Subscriptions → Access control (IAM) → Role assignments'."
      }
    ],
    "category": "Identity",
    "tags": [
      "rbac",
      "role",
      "role assignment",
      "iam",
      "access",
      "permissions"
    ]
  },
  "databases/create-sql-database": {
    "id": "databases/create-sql-database",
    "title": "Create a SQL Database",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/Microsoft.SQLDatabase",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label='Subscription']",
        "fallbackSelector": "[data-telemetryid='SubscriptionDropDown']",
        "title": "Choose your Subscription",
        "explanation": "Azure SQL Database pricing depends on the service tier and compute model (DTU or vCore). The vCore model lets you choose compute and storage independently and is recommended for production. Serverless tier scales to zero when idle — ideal for dev/test."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label='Resource group']",
        "fallbackSelector": "[name='resourceGroup']",
        "title": "Select or create a Resource Group",
        "explanation": "Place the SQL Database and its logical server in the same Resource Group as the application that uses it. This keeps costs and access control clear per project."
      },
      {
        "id": "db-name",
        "selector": "[aria-label='Database name']",
        "fallbackSelector": "[name='databaseName']",
        "title": "Give the database a name",
        "explanation": "The database name is used in connection strings. Keep it descriptive and environment-specific, e.g. 'myapp-prod' or 'myapp-dev'. The name must be unique within the logical server."
      },
      {
        "id": "server",
        "selector": "[aria-label='Server']",
        "fallbackSelector": "[data-telemetryid='ServerSelector']",
        "title": "Select or create a logical server",
        "explanation": "A logical SQL server is a management container for multiple databases — it is not a VM. It defines the admin login, firewall rules, and region. Multiple databases can share one server. Place the server in the same region as your application."
      },
      {
        "id": "compute-tier",
        "selector": "[aria-label='Compute + storage']",
        "fallbackSelector": "[data-telemetryid='ServiceTier']",
        "title": "Configure compute and storage",
        "explanation": "General Purpose: balanced CPU and memory for most workloads. Business Critical: in-memory OLTP, higher IOPS, built-in read replica. Hyperscale: up to 100 TB storage, fast backups. Start with General Purpose Serverless for dev — it scales to zero when not in use."
      },
      {
        "id": "backup-redundancy",
        "selector": "[aria-label='Backup storage redundancy']",
        "fallbackSelector": "[data-telemetryid='BackupRedundancy']",
        "title": "Choose backup redundancy",
        "explanation": "Locally redundant: backups stored in one region — cheapest. Zone-redundant: backups spread across availability zones. Geo-redundant: backups in a paired region — required for geo-restore after a regional outage. Choose based on your recovery objectives."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label='Review + create']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndCreate']",
        "title": "Click Review + create",
        "explanation": "After creation, configure the server firewall to allow your application's IP or Azure services. Use connection string from 'Settings → Connection strings'. Enable Microsoft Entra authentication instead of SQL login for better security."
      }
    ],
    "category": "Databases",
    "tags": [
      "sql",
      "database",
      "azure sql",
      "relational",
      "db"
    ]
  },
  "databases/create-cosmos-db": {
    "id": "databases/create-cosmos-db",
    "title": "Create a Cosmos DB",
    "version": "1.0.0",
    "lastVerified": "2026-06-23",
    "startUrl": "https://portal.azure.com/#create/Microsoft.DocumentDB",
    "steps": [
      {
        "id": "subscription",
        "selector": "[aria-label='Subscription']",
        "fallbackSelector": "[data-telemetryid='SubscriptionDropDown']",
        "title": "Choose your Subscription",
        "explanation": "Cosmos DB bills per Request Unit (RU/s) provisioned and per GB of storage. Serverless mode bills per operation — ideal for unpredictable or low traffic. Provisioned throughput is better for predictable, high-volume workloads."
      },
      {
        "id": "resource-group",
        "selector": "[aria-label='Resource group']",
        "fallbackSelector": "[name='resourceGroup']",
        "title": "Select or create a Resource Group",
        "explanation": "Place the Cosmos DB account in the same Resource Group as the application that reads and writes to it. One account can hold multiple databases and containers."
      },
      {
        "id": "account-name",
        "selector": "[aria-label='Account Name']",
        "fallbackSelector": "[name='accountName']",
        "title": "Give the account a name",
        "explanation": "The account name must be globally unique (3-44 characters, lowercase letters, digits, hyphens). It becomes the endpoint URL: accountname.documents.azure.com. Choose carefully — it cannot be changed after creation."
      },
      {
        "id": "api",
        "selector": "[aria-label='API']",
        "fallbackSelector": "[data-telemetryid='ApiSelector']",
        "title": "Choose the API",
        "explanation": "NoSQL (Core): native Cosmos DB with JSON documents — best performance and all features. MongoDB: wire-compatible with MongoDB — migrate existing apps without code changes. PostgreSQL: distributed PostgreSQL (Citus). Cassandra, Gremlin, Table: for specific use cases. Choose NoSQL unless you have an existing app using another API."
      },
      {
        "id": "region",
        "selector": "[aria-label='Location']",
        "fallbackSelector": "[data-telemetryid='RegionDropDown']",
        "title": "Choose a region",
        "explanation": "This is the primary write region. Cosmos DB supports global distribution — you can add read regions later at no extra storage cost. Choose the region closest to your primary write workload."
      },
      {
        "id": "capacity-mode",
        "selector": "[aria-label='Capacity mode']",
        "fallbackSelector": "[data-telemetryid='CapacityMode']",
        "title": "Choose the Capacity mode",
        "explanation": "Provisioned throughput: you reserve RU/s — predictable cost and performance, required for multi-region writes. Serverless: pay per operation — ideal for dev/test or sporadic production traffic. Autoscale (within provisioned): automatically scales between 10% and 100% of your max RU/s."
      },
      {
        "id": "review-create",
        "selector": "button[aria-label='Review + create']",
        "fallbackSelector": "button[data-telemetryid='ReviewAndCreate']",
        "title": "Click Review + create",
        "explanation": "Deployment takes 5-10 minutes. After creation, go to 'Data Explorer' to create databases and containers. Choose your partition key carefully — it determines how data is distributed and cannot be changed after container creation."
      }
    ],
    "category": "Databases",
    "tags": [
      "cosmos",
      "cosmosdb",
      "nosql",
      "mongodb",
      "database"
    ]
  },
};
