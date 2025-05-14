'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { ArrowLeft, Info, Layers, Cpu, Scale, Settings2, ShieldCheck, ChevronDown, CreditCard } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility for classnames
import FoundationModelSelector, { FoundationModel } from './FoundationModelSelector'; // Import the new component
import HardwareConfigurationSelector, { instanceTypeOptions, InstanceTypeId } from './HardwareConfigurationSelector'; // Import Hardware config component and InstanceTypeId
import ScalingConfigurationSelector from './ScalingConfigurationSelector'; // Import Scaling config component
import EnvironmentConfigurationSelector from './EnvironmentConfigurationSelector'; // Import Env config component
import SecuritySettingsSelector from './SecuritySettingsSelector'; // Import Security config component
import TermsOfServiceModal from './TermsOfServiceModal'; // Import ToS Modal
import PaymentMethodModal, { PaymentDetails } from './PaymentMethodModal'; // Import Payment Modal and PaymentDetails type

interface DeploymentFormData {
  endpointName: string;
  foundationModelId: string; // Or a more specific type if you have one for foundation models
  memoryAllocation: number;
  instanceType: InstanceTypeId; // Use the specific union type from HardwareConfigurationSelector
  dedicatedInstance: boolean;
  minInstances: number;
  maxInstances: number;
  enableAutoscaling: boolean;
  cooldownPeriod: string; // e.g., '5 minutes'
  environmentType: 'development' | 'staging' | 'production';
  region: string; // e.g., 'us-east-1'
  requestPriority: 'low' | 'normal' | 'high';
  accessControl: 'token-authentication' | 'no-authentication';
  apiTokenValue: string; // Store the generated API token string
  privateEndpoint: boolean;
  requestLogging: boolean;
  estimatedHourlyCost: number;
  estimatedMonthlyCost: number;
  autoscalingTarget: number;
  maxReplicas: number;
  environmentVariables: { key: string; value: string }[];
  secrets: { key: string; value: string }[];
  customHealthcheckPath: string;
  autoscalingTrigger: 'cpu' | 'gpu' | 'custom';
  billingAccount: string;
  healthCheckPath: string;
}

const mockFoundationModels: FoundationModel[] = [
  {
    id: 'llama-2-7b',
    name: 'Llama-2-7b',
    provider: 'Meta',
    description: 'A powerful foundational model ready for deployment, meta-llama-2-7b.',
    tags: ['text-generation', 'language-modeling'],
    params: '7B parameters',
    contextTokens: '530.0k',
    outputTokens: '65.0k',
    recommended: true,
    estimatedCostPerHour: 0.50, // Added estimated cost per hour
  },
  {
    id: 'llama-2-13b',
    name: 'Llama-2-13b',
    provider: 'Meta',
    description: 'A powerful foundational model ready for deployment, meta-llama-2-13b.',
    tags: ['text-generation', 'language-modeling'],
    params: '13B parameters',
    contextTokens: '530.0k',
    outputTokens: '65.0k',
    estimatedCostPerHour: 1.20, // Added estimated cost per hour
  },
  {
    id: 'llama-2-70b',
    name: 'Llama-2-70b',
    provider: 'Meta',
    description: 'A powerful foundational model ready for deployment, meta-llama-2-70b.',
    tags: ['text-generation', 'language-modeling'],
    params: '70B parameters',
    contextTokens: '745.0k',
    outputTokens: '48.0k',
    estimatedCostPerHour: 2.50, // Added estimated cost per hour
  },
  {
    id: 'mistral-7b-v0.1',
    name: 'Mistral-7B-v0.1',
    provider: 'Mistral AI',
    description: 'A powerful foundational model ready for deployment, mistral-7B-v0.1.',
    tags: ['text-generation', 'language-modeling'],
    params: '7B parameters',
    contextTokens: '680.0k',
    outputTokens: '42.3k',
    estimatedCostPerHour: 0.75, // Added estimated cost per hour
  },
  // Add more models as needed from screenshot
];

const initialFormData: DeploymentFormData = {
  endpointName: '',
  foundationModelId: 'llama-2-7b', // Default pre-selected
  memoryAllocation: 16, // Default based on screenshot
  instanceType: 'gpu-nvidia-t4',
  dedicatedInstance: false,
  minInstances: 1,
  maxInstances: 3,
  enableAutoscaling: true,
  cooldownPeriod: '5 minutes',
  environmentType: 'development',
  region: 'us-east-1',
  requestPriority: 'normal',
  accessControl: 'no-authentication',
  apiTokenValue: '',
  privateEndpoint: false,
  requestLogging: true, // Default to true, common practice
  estimatedHourlyCost: 1.60, // Initial placeholder from screenshot
  estimatedMonthlyCost: 1168.00, // Initial placeholder from screenshot
  autoscalingTarget: 50,
  maxReplicas: 10,
  environmentVariables: [],
  secrets: [],
  customHealthcheckPath: '',
  autoscalingTrigger: 'cpu',
  billingAccount: 'default-billing-id',
  healthCheckPath: '',
};

const AccordionItem = React.forwardRef<HTMLDivElement, Accordion.AccordionItemProps & { icon?: React.ElementType }>(({ children, className, icon: Icon, ...props }, forwardedRef) => (
  <Accordion.Item
    className={cn('border-b border-gray-700 overflow-hidden', className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </Accordion.Item>
));
AccordionItem.displayName = Accordion.Item.displayName;

const AccordionTrigger = React.forwardRef<HTMLButtonElement, Accordion.AccordionTriggerProps & { icon?: React.ElementType }>(({ children, className, icon: Icon, ...props }, forwardedRef) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      className={cn(
        'flex flex-1 items-center justify-between py-4 px-6 font-medium transition-all hover:bg-gray-700 data-[state=open]:bg-gray-750',
        'group text-gray-100 text-lg',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="flex items-center">
        {Icon && <Icon className="mr-3 h-5 w-5 text-blue-400" />}
        {children}
      </div>
      <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 text-gray-400" />
    </Accordion.Trigger>
  </Accordion.Header>
));
AccordionTrigger.displayName = Accordion.Trigger.displayName;

const AccordionContent = React.forwardRef<HTMLDivElement, Accordion.AccordionContentProps>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={cn(
      'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className="py-4 px-6 bg-gray-800/30">{children}</div>
  </Accordion.Content>
));
AccordionContent.displayName = Accordion.Content.displayName;

export default function NewDeploymentPage() {
  const router = useRouter(); // Initialize useRouter
  const [formData, setFormData] = useState<DeploymentFormData>(initialFormData);
  const [defaultAccordionValues, setDefaultAccordionValues] = useState<string[]>([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [confirmedPaymentDetails, setConfirmedPaymentDetails] = useState<PaymentDetails | null>(null);

  // Open first two accordions by default, mimics screenshot behavior
  useEffect(() => {
    setDefaultAccordionValues(['item-foundation-model', 'item-hardware-config']);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean = value;
    if (type === 'number') {
      processedValue = parseInt(value, 10);
    } else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const updateFoundationModel = (modelId: string) => {
    setFormData(prev => ({
      ...prev,
      foundationModelId: modelId,
    }));
  };

  const updateMemoryAllocation = (value: number) => {
    setFormData(prev => ({
      ...prev,
      memoryAllocation: value,
    }));
  };

  const updateInstanceType = (typeId: InstanceTypeId) => {
    const selectedInstance = instanceTypeOptions.find(opt => opt.id === typeId);
    setFormData(prev => ({
      ...prev,
      instanceType: typeId,
      // Optionally adjust memory if instance has a typical RAM, e.g.,
      // memoryAllocation: selectedInstance?.ramGb || prev.memoryAllocation,
    }));
  };

  const updateScalingParams = (params: Partial<Pick<DeploymentFormData, 'minInstances' | 'maxInstances' | 'enableAutoscaling' | 'autoscalingTrigger' | 'autoscalingTarget'>>) => {
    setFormData(prev => ({
      ...prev,
      ...params,
      // Ensure minInstances <= maxInstances
      minInstances: params.minInstances !== undefined && params.maxInstances !== undefined 
                      ? Math.min(params.minInstances, params.maxInstances) 
                      : params.minInstances !== undefined 
                          ? Math.min(params.minInstances, prev.maxInstances) 
                          : prev.minInstances,
      maxInstances: params.maxInstances !== undefined && params.minInstances !== undefined
                      ? Math.max(params.minInstances, params.maxInstances)
                      : params.maxInstances !== undefined
                          ? Math.max(params.maxInstances, prev.minInstances)
                          : prev.maxInstances,
    }));
  };

  const updateEnvironmentParams = (params: Partial<Pick<DeploymentFormData, 'environmentType' | 'region' | 'requestPriority' | 'environmentVariables' | 'secrets'>>) => {
    setFormData(prev => ({
      ...prev,
      ...params,
    }));
  };

  const updateSecurityParams = (params: Partial<Pick<DeploymentFormData, 'accessControl' | 'apiTokenValue' | 'privateEndpoint' | 'requestLogging'>>) => {
    setFormData(prev => ({
      ...prev,
      ...params,
      // If switching away from token auth, clear the token
      apiTokenValue: params.accessControl === 'no-authentication' ? '' : (params.apiTokenValue !== undefined ? params.apiTokenValue : prev.apiTokenValue),
    }));
  };

  // Dummy API token generator
  const generateApiToken = () => {
    const newToken = `radium_token_${Math.random().toString(36).substr(2, 16)}_${Date.now()}`;
    updateSecurityParams({ apiTokenValue: newToken, accessControl: 'token-authentication' }); // Ensure accessControl is set
  };

  const handleActualDeployment = () => {
    console.log('All checks passed, proceeding with actual deployment with data:', formData);
    console.log('Payment Details for deployment:', confirmedPaymentDetails);

    // Simulate deployment initiation
    const mockDeploymentId = `dep_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Mock Deployment ID:', mockDeploymentId);

    // Actual deployment logic would go here (e.g., API call)
    // For now, let's simulate a success and redirect to a status page
    alert('Deployment Initiated (Simulated)! Check console for data. Redirecting to status page...');
    
    router.push(`/deployments/${mockDeploymentId}`);
  };

  const handleDeploy = () => {
    // Validate form data (basic example)
    if (!formData.endpointName.trim()) {
      alert('Please enter an endpoint name.');
      // setActiveAccordionItem('item-model-config'); // Open the relevant section
      // TODO: Focus the endpoint name input
      return;
    }

    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }
    // If terms are accepted, proceed to payment check
    if (!paymentConfirmed) {
      setShowPaymentModal(true);
      return;
    }

    // If terms and payment are confirmed, proceed to actual deployment
    handleActualDeployment();
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTermsModal(false); // Close modal
    // Automatically attempt to deploy again (will now pass terms check)
    handleDeploy();
  };

  const handleConfirmPayment = (details: PaymentDetails) => {
    setConfirmedPaymentDetails(details);
    setPaymentConfirmed(true);
    setShowPaymentModal(false); // Close modal
    // Automatically attempt to deploy again (will now pass payment check)
    handleDeploy();
  };

  useEffect(() => {
    let hourlyCostPerInstance = 0;

    // 1. Foundation Model Cost
    const selectedModel = mockFoundationModels.find(model => model.id === formData.foundationModelId);
    if (selectedModel) {
      hourlyCostPerInstance += selectedModel.estimatedCostPerHour || 0;
    }

    // 2. Hardware Instance Cost
    const selectedInstanceOption = instanceTypeOptions.find(opt => opt.id === formData.instanceType);
    if (selectedInstanceOption) {
      hourlyCostPerInstance += selectedInstanceOption.costPerHour || 0;
    }

    // 3. Calculate Effective Instances for Scaling
    let effectiveInstances = formData.minInstances;
    if (formData.enableAutoscaling && formData.maxInstances > formData.minInstances) {
      // Assume 50% utilization of the scalable portion (max - min)
      effectiveInstances = formData.minInstances + (formData.maxInstances - formData.minInstances) * 0.5;
    } else if (formData.enableAutoscaling && formData.maxInstances <= formData.minInstances) {
      // If autoscaling is on but max isn't greater than min, just use minInstances.
      // (This case should ideally be prevented by UI logic ensuring max >= min)
      effectiveInstances = formData.minInstances;
    }

    let totalHourlyCost = hourlyCostPerInstance * effectiveInstances;

    // 4. Ancillary Costs (placeholders)
    if (formData.privateEndpoint) {
      totalHourlyCost += 0.01; // Placeholder: $0.01/hr for private endpoint
    }
    if (formData.requestLogging) {
      totalHourlyCost += 0.005; // Placeholder: $0.005/hr for request logging
    }

    // Region could be a multiplier here if we had regional pricing data
    // e.g., totalHourlyCost *= getRegionCostFactor(formData.region);

    const dailyCost = totalHourlyCost * 24;
    const monthlyCost = dailyCost * 30.5; // Using an average of 30.5 days per month

    setFormData(prev => ({
      ...prev,
      estimatedHourlyCost: parseFloat(totalHourlyCost.toFixed(4)), // Increased precision for hourly
      estimatedMonthlyCost: parseFloat(monthlyCost.toFixed(2)),
    }));
  }, [
    formData.foundationModelId,
    formData.instanceType,
    formData.minInstances,
    formData.maxInstances,
    formData.enableAutoscaling,
    formData.privateEndpoint,
    formData.requestLogging,
  ]);

  if (!defaultAccordionValues.length) {
    // Ensure default values are set before rendering Accordion to prevent hydration issues with Radix
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pb-28"> {/* Added pb-28 for footer space */}
      <div className="w-full max-w-5xl bg-gray-850 rounded-lg shadow-2xl mt-8 mb-8"> {/* Increased max-width */}
        {/* Header */} 
        <div className="flex items-center p-6 border-b border-gray-700">
          <button onClick={() => console.log("Attempting to navigate back...")} className="p-2 rounded-full hover:bg-gray-700 mr-4 focus:outline-none focus:ring-2 focus:ring-gray-600">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold">New Deployment</h1>
        </div>

        {/* Main Content Area */}
        <div className="p-6 space-y-6">
          {/* Endpoint Name Input */}
          <div>
            <label htmlFor="endpointName" className="block text-sm font-medium text-gray-300 mb-1">
              Endpoint Name
            </label>
            <input
              type="text"
              name="endpointName"
              id="endpointName"
              value={formData.endpointName}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              placeholder="e.g., llama-2-7b-chat-prod"
            />
            <p className="mt-2 text-xs text-gray-400">
              Enter a unique name for your deployment endpoint. This will be part of your API URL.
            </p>
          </div>

          {/* Accordion Sections */}
          <Accordion.Root type="multiple" defaultValue={defaultAccordionValues} className="w-full rounded-md border border-gray-700 bg-gray-800/50">
            <AccordionItem value="item-foundation-model" icon={Layers}>
              <AccordionTrigger icon={Layers}>Foundation Model (Pre-selected)</AccordionTrigger>
              <AccordionContent>
                <FoundationModelSelector 
                  models={mockFoundationModels} 
                  selectedModelId={formData.foundationModelId} 
                  onSelectModel={updateFoundationModel} 
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-hardware-config" icon={Cpu}>
              <AccordionTrigger icon={Cpu}>Hardware Configuration</AccordionTrigger>
              <AccordionContent>
                {/* <p className="text-gray-300">Configure the underlying hardware for your model deployment.</p> */}
                {/* Placeholder for hardware selection UI */}
                {/* <div className="mt-4 p-4 bg-gray-700 rounded">Hardware config controls here (Memory, Instance, GPU). (See screenshot 3)</div> */}
                <HardwareConfigurationSelector 
                  memoryAllocation={formData.memoryAllocation}
                  onMemoryChange={updateMemoryAllocation}
                  instanceType={formData.instanceType}
                  onInstanceTypeChange={updateInstanceType}
                  // dedicatedInstance={formData.dedicatedInstance} // Pass if implementing dedicated instance toggle
                  // onDedicatedInstanceChange={(value) => setFormData(prev => ({...prev, dedicatedInstance: value}))} // Pass if implementing
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-scaling-config" icon={Scale}>
              <AccordionTrigger icon={Scale}>Scaling Configuration</AccordionTrigger>
              <AccordionContent>
                <ScalingConfigurationSelector
                  minInstances={formData.minInstances}
                  onMinInstancesChange={(value) => updateScalingParams({ minInstances: value })}
                  maxInstances={formData.maxInstances}
                  onMaxInstancesChange={(value) => updateScalingParams({ maxInstances: value })}
                  enableAutoscaling={formData.enableAutoscaling}
                  onEnableAutoscalingChange={(enabled) => updateScalingParams({ enableAutoscaling: enabled })}
                  autoscalingTrigger={formData.autoscalingTrigger as 'cpu' | 'gpu' | 'custom'} // Added type assertion
                  onAutoscalingTriggerChange={(trigger) => updateScalingParams({ autoscalingTrigger: trigger })}
                  autoscalingTarget={formData.autoscalingTarget}
                  onAutoscalingTargetChange={(value) => updateScalingParams({ autoscalingTarget: value })}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-env-config" icon={Settings2}>
              <AccordionTrigger icon={Settings2}>Environment Configuration</AccordionTrigger>
              <AccordionContent>
                <EnvironmentConfigurationSelector
                  environmentType={formData.environmentType}
                  onEnvironmentTypeChange={(value) => updateEnvironmentParams({ environmentType: value })}
                  region={formData.region}
                  onRegionChange={(value) => updateEnvironmentParams({ region: value })}
                  requestPriority={formData.requestPriority}
                  onRequestPriorityChange={(value) => updateEnvironmentParams({ requestPriority: value })}
                  environmentVariables={formData.environmentVariables}
                  onEnvironmentVariablesChange={(vars) => updateEnvironmentParams({ environmentVariables: vars })}
                  secrets={formData.secrets}
                  onSecretsChange={(secs) => updateEnvironmentParams({ secrets: secs })}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-security-settings" icon={ShieldCheck}>
              <AccordionTrigger icon={ShieldCheck}>Security Settings</AccordionTrigger>
              <AccordionContent>
                <SecuritySettingsSelector
                  accessControl={formData.accessControl}
                  onAccessControlChange={(value) => updateSecurityParams({ accessControl: value })}
                  enablePrivateEndpoint={formData.privateEndpoint}
                  onEnablePrivateEndpointChange={(enabled) => updateSecurityParams({ privateEndpoint: enabled })}
                  enableRequestLogging={formData.requestLogging}
                  onEnableRequestLoggingChange={(enabled) => updateSecurityParams({ requestLogging: enabled })}
                  apiToken={formData.apiTokenValue}
                  onGenerateApiToken={generateApiToken}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-billing" icon={CreditCard}>
              <AccordionTrigger icon={CreditCard}>Billing & Quotas</AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-gray-700 rounded">Billing & Quotas controls will go here. (See screenshot 7)</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion.Root>
        </div>
      </div>

      {/* Floating Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg shadow-lg rounded-t-lg p-4 flex items-center justify-between border-t border-l border-r border-gray-700">
            <div className="flex items-center">
              <p className="text-sm text-gray-300 mr-2">Estimated Cost:</p>
              <div>
                <span className="text-xl font-bold text-green-400">${formData.estimatedHourlyCost.toFixed(2)}</span>
                <span className="text-xs text-gray-400">/hourly</span>
                <span className="text-md font-semibold text-gray-300 ml-3">${formData.estimatedMonthlyCost.toFixed(2)}</span>
                <span className="text-xs text-gray-400">/monthly</span>
              </div>
              <button className="ml-3 p-1.5 rounded-full hover:bg-gray-700">
                <Info size={16} className="text-gray-400" />
              </button>
            </div>
            <button
              onClick={handleDeploy}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Deploy Now
            </button>
          </div>
        </div>
      </div>
      <TermsOfServiceModal 
        isOpen={showTermsModal} 
        onOpenChange={setShowTermsModal} 
        onAccept={handleAcceptTerms} 
      />
      <PaymentMethodModal 
        isOpen={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}
