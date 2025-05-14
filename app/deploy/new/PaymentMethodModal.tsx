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
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Landmark } from 'lucide-react'; // Icons

interface ACHDetails {
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings' | '';
  bankName: string;
}

interface CreditCardDetails {
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string; // MM/YY
  cvc: string;
  zipCode: string; // Optional, but common for validation
}

export type PaymentDetails = 
  | { type: 'ach'; details: ACHDetails }
  | { type: 'cc'; details: CreditCardDetails };

interface PaymentMethodModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirmPayment: (paymentDetails: PaymentDetails) => void;
}

export default function PaymentMethodModal({
  isOpen,
  onOpenChange,
  onConfirmPayment,
}: PaymentMethodModalProps) {
  const [paymentType, setPaymentType] = useState<'ach' | 'cc'>('cc');
  const [achDetails, setAchDetails] = useState<ACHDetails>({
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: '',
    bankName: '',
  });
  const [ccDetails, setCcDetails] = useState<CreditCardDetails>({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    zipCode: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleAchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAchDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleCcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'cardNumber') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 16);
    } else if (name === 'expiryDate') {
      processedValue = value.replace(/[^0-9/]/g, '').slice(0, 5);
      if (processedValue.length === 2 && !processedValue.includes('/')) {
        processedValue += '/';
      } else if (processedValue.length === 3 && processedValue.charAt(2) !== '/'){
        processedValue = processedValue.slice(0,2) + '/' + processedValue.slice(2);
      }
    } else if (name === 'cvc') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 4);
    } else if (name === 'zipCode') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 5);
    }
    setCcDetails(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleAccountTypeChange = (value: 'checking' | 'savings') => {
    setAchDetails(prev => ({ ...prev, accountType: value }));
  };

  const validateACHForm = (): boolean => {
    if (!achDetails.accountHolderName.trim()) return false;
    if (!achDetails.accountNumber.trim() || !/^[0-9]+$/.test(achDetails.accountNumber)) return false;
    if (!achDetails.routingNumber.trim() || !/^[0-9]{9}$/.test(achDetails.routingNumber)) return false;
    if (!achDetails.accountType) return false;
    return true;
  };

  const validateCCForm = (): boolean => {
    if (!ccDetails.cardHolderName.trim()) return false;
    if (!ccDetails.cardNumber.trim() || ccDetails.cardNumber.length < 13 || ccDetails.cardNumber.length > 16 ) return false;
    if (!ccDetails.expiryDate.trim() || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(ccDetails.expiryDate)) return false;
    if (!ccDetails.cvc.trim() || ccDetails.cvc.length < 3 || ccDetails.cvc.length > 4) return false;
    // zipCode can be optional or validated if required by payment gateway
    return true;
  };

  const handleSubmit = () => {
    setFormError(null);
    if (paymentType === 'ach') {
      if (validateACHForm()) {
        onConfirmPayment({ type: 'ach', details: achDetails });
        onOpenChange(false);
      } else {
        setFormError('Please fill in all required ACH fields with valid information.');
      }
    } else if (paymentType === 'cc') {
      if (validateCCForm()) {
        onConfirmPayment({ type: 'cc', details: ccDetails });
        onOpenChange(false);
      } else {
        setFormError('Please fill in all required Credit Card fields with valid information.');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gray-800 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl text-sky-400 flex items-center">
            {paymentType === 'cc' ? <CreditCard size={24} className="mr-2" /> : <Landmark size={24} className="mr-2" />}
            {paymentType === 'cc' ? 'Add Credit Card' : 'Add Bank Account (ACH)'}
          </DialogTitle>
          <DialogDescription className="text-gray-400 pt-2">
            Securely add your payment information.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
            <Label className="text-sm font-medium text-gray-300 mb-2 block">Payment Type</Label>
            <RadioGroup 
                defaultValue="cc" 
                value={paymentType} 
                onValueChange={(val: 'cc' | 'ach') => setPaymentType(val)} 
                className="grid grid-cols-2 gap-4 mb-6"
            >
                <Label 
                    htmlFor="cc-payment" 
                    className={`flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-gray-700 cursor-pointer ${paymentType === 'cc' ? 'border-sky-500 bg-gray-700' : 'border-gray-600'}`}
                >
                    <RadioGroupItem value="cc" id="cc-payment" className="sr-only" />
                    <CreditCard className={`mb-3 h-6 w-6 ${paymentType === 'cc' ? 'text-sky-400' : 'text-gray-400'}`} />
                    Credit Card
                </Label>
                <Label 
                    htmlFor="ach-payment" 
                    className={`flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-gray-700 cursor-pointer ${paymentType === 'ach' ? 'border-sky-500 bg-gray-700' : 'border-gray-600'}`}
                >
                    <RadioGroupItem value="ach" id="ach-payment" className="sr-only" />
                    <Landmark className={`mb-3 h-6 w-6 ${paymentType === 'ach' ? 'text-sky-400' : 'text-gray-400'}`} />
                    Bank Account (ACH)
                </Label>
            </RadioGroup>
        </div>

        {paymentType === 'cc' && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="cardHolderName" className="text-sm font-medium text-gray-300">Cardholder Name</Label>
              <Input id="cardHolderName" name="cardHolderName" value={ccDetails.cardHolderName} onChange={handleCcChange} placeholder="John M. Doe" className="mt-1 bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-300">Card Number</Label>
              <Input id="cardNumber" name="cardNumber" value={ccDetails.cardNumber} onChange={handleCcChange} placeholder="0000 0000 0000 0000" className="mt-1 bg-gray-700 border-gray-600 text-white" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-300">Expiry (MM/YY)</Label>
                <Input id="expiryDate" name="expiryDate" value={ccDetails.expiryDate} onChange={handleCcChange} placeholder="MM/YY" className="mt-1 bg-gray-700 border-gray-600 text-white" />
              </div>
              <div>
                <Label htmlFor="cvc" className="text-sm font-medium text-gray-300">CVC</Label>
                <Input id="cvc" name="cvc" value={ccDetails.cvc} onChange={handleCcChange} placeholder="123" className="mt-1 bg-gray-700 border-gray-600 text-white" />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-sm font-medium text-gray-300">Zip Code</Label>
                <Input id="zipCode" name="zipCode" value={ccDetails.zipCode} onChange={handleCcChange} placeholder="90210" className="mt-1 bg-gray-700 border-gray-600 text-white" />
              </div>
            </div>
          </div>
        )}

        {paymentType === 'ach' && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="accountHolderName" className="text-sm font-medium text-gray-300">Account Holder Name</Label>
              <Input id="accountHolderName" name="accountHolderName" value={achDetails.accountHolderName} onChange={handleAchChange} placeholder="John M. Doe" className="mt-1 bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label htmlFor="routingNumber" className="text-sm font-medium text-gray-300">Routing Number</Label>
              <Input id="routingNumber" name="routingNumber" value={achDetails.routingNumber} onChange={handleAchChange} placeholder="123456789" maxLength={9} className="mt-1 bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-300">Account Number</Label>
              <Input id="accountNumber" name="accountNumber" value={achDetails.accountNumber} onChange={handleAchChange} placeholder="000123456789" className="mt-1 bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-300 mb-1 block">Account Type</Label>
              <RadioGroup value={achDetails.accountType} onValueChange={handleAccountTypeChange} className="flex space-x-4 bg-gray-750 p-2 rounded-md">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="checking" id="checking" className="border-gray-500 text-sky-400"/>
                  <Label htmlFor="checking" className="text-gray-300">Checking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="savings" id="savings" className="border-gray-500 text-sky-400"/>
                  <Label htmlFor="savings" className="text-gray-300">Savings</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="bankName" className="text-sm font-medium text-gray-300">Bank Name (Optional)</Label>
              <Input id="bankName" name="bankName" value={achDetails.bankName} onChange={handleAchChange} placeholder="Example Bank Inc." className="mt-1 bg-gray-700 border-gray-600 text-white" />
            </div>
          </div>
        )}
        
        {formError && (
          <p className="text-sm text-red-400 bg-red-900/30 p-3 rounded-md mt-4">{formError}</p>
        )}

        <DialogFooter className="sm:justify-between mt-6">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-300">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            Confirm Payment Method
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
