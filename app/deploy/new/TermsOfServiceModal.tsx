'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'; // Assuming Dialog is a ShadCN component
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming Checkbox is a ShadCN component
import { Label } from '@/components/ui/label';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAccept: () => void;
}

export default function TermsOfServiceModal({
  isOpen,
  onOpenChange,
  onAccept,
}: TermsOfServiceModalProps) {
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const handleAccept = () => {
    if (isTermsChecked) {
      onAccept();
      onOpenChange(false); // Close modal on accept
    }
  };

  const placeholderTerms = `
Last updated: ${new Date().toLocaleDateString()}\n
Please read these terms and conditions carefully before using Our Service.\n
Interpretation and Definitions\n
Interpretation\nThe words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.\n
Definitions\nFor the purposes of these Terms and Conditions:\n
  * Affiliate means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.\n  * Country refers to: California, United States\n  * Company (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Radium Chat.\n  * Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.\n  * Service refers to the Website.\n  * Terms and Conditions (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.\n  * Third-party Social Media Service means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.\n  * Website refers to Radium Chat, accessible from [Your Website URL]\n  * You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.\n
Acknowledgment\n
These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.\n
Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.\n
By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.\n
You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.\n
Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.\n
  (Content truncated for brevity...)
  `;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl text-sky-400">Terms of Service</DialogTitle>
          <DialogDescription className="text-gray-400 pt-2">
            Please read and accept the terms and conditions to proceed with your deployment.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 pr-6 max-h-[300px] overflow-y-auto text-sm text-gray-300 bg-gray-750 p-3 rounded-md scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <pre className="whitespace-pre-wrap font-sans">{placeholderTerms}</pre>
        </div>
        <div className="flex items-center space-x-2 mb-6">
          <Checkbox 
            id="terms-checkbox" 
            checked={isTermsChecked} 
            onCheckedChange={(checked: boolean) => setIsTermsChecked(checked)} 
            className="border-gray-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white focus:ring-sky-500"
          />
          <Label htmlFor="terms-checkbox" className="text-sm font-medium text-gray-300 cursor-pointer">
            I have read and agree to the Terms of Service.
          </Label>
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-300">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleAccept} 
            disabled={!isTermsChecked}
            className="bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-50"
          >
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
