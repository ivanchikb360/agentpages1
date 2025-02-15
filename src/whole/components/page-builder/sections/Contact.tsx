import React from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent } from '../../ui/card';
import { Phone, Mail, Clock } from 'lucide-react';

interface ContactProps {
  content: {
    title?: string;
    subtitle?: string;
    agent: {
      name: string;
      phone: string;
      email: string;
      hours?: string;
      photo?: string;
    };
    form: {
      title?: string;
      fields: Array<{
        type: 'text' | 'email' | 'phone' | 'textarea';
        label: string;
        placeholder?: string;
        required?: boolean;
      }>;
      submitText?: string;
    };
  };
}

export function Contact({ content }: ContactProps) {
  const defaultContent = {
    title: 'Contact Agent',
    subtitle: 'Get in touch to schedule a viewing',
    form: {
      title: 'Send a Message',
      submitText: 'Send Inquiry',
      fields: [
        { type: 'text', label: 'Name', required: true },
        { type: 'email', label: 'Email', required: true },
        { type: 'phone', label: 'Phone' },
        { type: 'textarea', label: 'Message', required: true },
      ],
    },
  };

  const mergedContent = { ...defaultContent, ...content };

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{mergedContent.title}</h2>
          {mergedContent.subtitle && (
            <p className="text-gray-600">{mergedContent.subtitle}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {content.agent.photo && (
                  <img
                    src={content.agent.photo}
                    alt={content.agent.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    {content.agent.name}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      <span>{content.agent.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      <span>{content.agent.email}</span>
                    </div>
                    {content.agent.hours && (
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>{content.agent.hours}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6">
                {mergedContent.form.title}
              </h3>
              <form className="space-y-4">
                {mergedContent.form.fields.map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    ) : (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
                <Button type="submit" className="w-full">
                  {mergedContent.form.submitText}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 