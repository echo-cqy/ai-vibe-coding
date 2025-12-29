import React from 'react';
import { Settings, User, Monitor } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your preferences and workspace configuration.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
              <p className="text-sm text-gray-500">Your personal information</p>
            </div>
          </div>
          
          <div className="grid gap-4 max-w-md">
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Display Name</label>
                <input type="text" disabled value="Demo User" className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500" />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" disabled value="demo@example.com" className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500" />
             </div>
          </div>
        </div>

        {/* Editor Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Monitor size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Editor & Theme</h2>
              <p className="text-sm text-gray-500">Customize your coding environment</p>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                   <h3 className="font-medium text-gray-900">Dark Mode</h3>
                   <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-gray-200 rounded-full cursor-pointer">
                    <span className="translate-x-0 inline-block w-6 h-6 bg-white rounded-full shadow transform transition duration-200 ease-in-out border border-gray-200"></span>
                </div>
             </div>
             
             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                   <h3 className="font-medium text-gray-900">Font Size</h3>
                   <p className="text-sm text-gray-500">Adjust code editor font size</p>
                </div>
                <select className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-md text-sm">
                   <option>12px</option>
                   <option>14px</option>
                   <option>16px</option>
                </select>
             </div>
          </div>
        </div>

        {/* Model Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Model Configuration</h2>
              <p className="text-sm text-gray-500">Configure LLM parameters</p>
            </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Default Model</label>
                <select className="w-full max-w-xs bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                   <option>GPT-4 Turbo</option>
                   <option>Claude 3.5 Sonnet</option>
                   <option>Gemini Pro</option>
                </select>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
