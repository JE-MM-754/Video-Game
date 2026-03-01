import React from 'react';
import Link from 'next/link';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield, 
  BarChart3,
  PlayCircle,
  Lightbulb,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const CinchITHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CinchIT AI</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <Link 
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Launch Platform
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium">Enterprise AI Sales Intelligence</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Accelerate Your Sales with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> AI Intelligence</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Transform your sales process with YouTube prospect research, competitive analysis, 
                and AI-powered lead reactivation. Close more deals with data-driven insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center justify-center transition-all transform hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center justify-center transition-colors">
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center space-x-6 mt-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Setup in 5 minutes</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="bg-black/40 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Prospect Analysis</span>
                    <span className="text-green-400 text-sm">Live</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">TechCorp Analysis</div>
                          <div className="text-gray-400 text-sm">YouTube: 15K subscribers, Product Demos</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">Competitor Alert</div>
                          <div className="text-gray-400 text-sm">New funding: Series B $25M</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">Lead Reactivated</div>
                          <div className="text-gray-400 text-sm">Dead lead → 85% reactivation score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Complete Sales Intelligence Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to research prospects, analyze competitors, and reactivate dead leads with AI precision.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* YouTube Intelligence */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">YouTube Intelligence</h3>
              <p className="text-gray-300 mb-4">
                Deep prospect research using YouTube Data API v3. Analyze content strategy, engagement metrics, and audience targeting.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Channel performance analysis</li>
                <li>• Content strategy insights</li>
                <li>• Competitive benchmarking</li>
                <li>• Audience intelligence</li>
              </ul>
            </div>

            {/* Dead Lead Reactivation */}
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Dead Lead Reactivation</h3>
              <p className="text-gray-300 mb-4">
                AI-powered scoring identifies reactivation opportunities. Automated campaigns re-engage dormant prospects.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• AI opportunity scoring</li>
                <li>• Signal-based triggering</li>
                <li>• Personalized campaigns</li>
                <li>• Performance tracking</li>
              </ul>
            </div>

            {/* Competitor Analysis */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Competitor Analysis</h3>
              <p className="text-gray-300 mb-4">
                Real-time competitive intelligence gathering. Track funding, hiring, product updates, and market positioning.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Real-time monitoring</li>
                <li>• Funding & hiring alerts</li>
                <li>• Battle card generation</li>
                <li>• Market positioning</li>
              </ul>
            </div>

            {/* Market Signals */}
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Market Signals</h3>
              <p className="text-gray-300 mb-4">
                Industry trend monitoring and buying signal detection. Never miss a market opportunity again.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Industry trend analysis</li>
                <li>• Buying signal detection</li>
                <li>• News & event monitoring</li>
                <li>• Opportunity alerts</li>
              </ul>
            </div>

            {/* API Integration */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">API Integration</h3>
              <p className="text-gray-300 mb-4">
                Seamless CRM integration with Salesforce, HubSpot, Pipedrive. RESTful API for custom integrations.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• CRM integrations</li>
                <li>• RESTful API access</li>
                <li>• Webhook support</li>
                <li>• Real-time syncing</li>
              </ul>
            </div>

            {/* Enterprise Security */}
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Enterprise Security</h3>
              <p className="text-gray-300 mb-4">
                Bank-grade security with SOC 2 compliance, encrypted data storage, and comprehensive audit trails.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• SOC 2 compliance</li>
                <li>• Data encryption</li>
                <li>• Audit trails</li>
                <li>• Role-based access</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Accelerate Your Sales?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join leading sales teams using AI intelligence to close more deals faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center justify-center transition-all transform hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-lg font-semibold transition-colors">
              Schedule Demo
            </button>
          </div>
          
          <div className="mt-8 text-gray-400">
            <p>14-day free trial • No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CinchIT AI</span>
              </div>
              <p className="text-gray-400">
                Enterprise-grade AI sales intelligence platform.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 CinchIT AI Sales Engine. Built by Jamie Erickson. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CinchITHomePage;