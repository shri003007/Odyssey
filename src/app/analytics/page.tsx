'use client'

import { useState } from 'react'
import { Box, Flex, Heading, Text, Button, Input } from '@sparrowengg/twigs-react'
import { TrendingUp, Users, Eye, Clock, Calendar, ChevronDown, ArrowUpRight, ArrowDownRight, Download, Search, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Sample data for charts
const performanceData = [
  { month: 'Jan', engagement: 45, reach: 2100, clicks: 350 },
  { month: 'Feb', engagement: 52, reach: 2400, clicks: 420 },
  { month: 'Mar', engagement: 49, reach: 2300, clicks: 380 },
  { month: 'Apr', engagement: 62, reach: 2800, clicks: 490 },
  { month: 'May', engagement: 55, reach: 2600, clicks: 460 },
  { month: 'Jun', engagement: 72, reach: 3200, clicks: 580 },
  { month: 'Jul', engagement: 80, reach: 3800, clicks: 690 }
]

// Sample campaign data
const campaigns = [
  { 
    id: 1, 
    name: 'Summer Sale', 
    platform: 'Instagram', 
    status: 'active',
    engagement: 7.8,
    reach: 12400,
    clicks: 1850,
    conversion: 3.2,
    trend: 'up'
  },
  { 
    id: 2, 
    name: 'Product Launch', 
    platform: 'Facebook', 
    status: 'active',
    engagement: 6.4,
    reach: 8600,
    clicks: 1240,
    conversion: 2.8,
    trend: 'up'
  },
  { 
    id: 3, 
    name: 'Brand Awareness', 
    platform: 'Twitter', 
    status: 'ended',
    engagement: 5.2,
    reach: 6200,
    clicks: 890,
    conversion: 1.9,
    trend: 'down'
  },
  { 
    id: 4, 
    name: 'Email Newsletter', 
    platform: 'Email', 
    status: 'scheduled',
    engagement: 0,
    reach: 0,
    clicks: 0,
    conversion: 0,
    trend: 'neutral'
  }
]

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('30d')

  return (
    <Box className="container py-6 px-4">
      <Flex className="flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <Box>
          <Heading as="h1" className="text-3xl font-bold mb-1">Analytics</Heading>
          <Text className="text-muted-foreground">
            Track your marketing performance and campaign metrics
          </Text>
        </Box>
        
        <Flex className="gap-3 mt-4 md:mt-0">
          <Button variant="outline" size="sm" rightIcon={<Calendar size={14} />}>
            Last 30 Days <ChevronDown size={14} className="ml-1" />
          </Button>
          <Button variant="outline" size="sm" rightIcon={<Download size={14} />}>
            Export
          </Button>
        </Flex>
      </Flex>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Key Metrics */}
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <Flex className="items-start justify-between mb-4">
              <Box className="p-2 rounded-md bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </Box>
              <Box className="flex items-center text-sm">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <Text className="text-emerald-500 font-medium">+12.5%</Text>
              </Box>
            </Flex>
            <Text className="text-muted-foreground text-sm mb-1">Total Engagement</Text>
            <Heading as="h3" className="text-2xl font-bold">8.4k</Heading>
            <Text className="text-xs text-muted-foreground mt-1">vs. 7.2k previous period</Text>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <Flex className="items-start justify-between mb-4">
              <Box className="p-2 rounded-md bg-blue-500/10">
                <Eye className="h-5 w-5 text-blue-500" />
              </Box>
              <Box className="flex items-center text-sm">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <Text className="text-emerald-500 font-medium">+18.2%</Text>
              </Box>
            </Flex>
            <Text className="text-muted-foreground text-sm mb-1">Total Reach</Text>
            <Heading as="h3" className="text-2xl font-bold">32.5k</Heading>
            <Text className="text-xs text-muted-foreground mt-1">vs. 27.5k previous period</Text>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <Flex className="items-start justify-between mb-4">
              <Box className="p-2 rounded-md bg-amber-500/10">
                <Users className="h-5 w-5 text-amber-500" />
              </Box>
              <Box className="flex items-center text-sm">
                <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                <Text className="text-emerald-500 font-medium">+7.8%</Text>
              </Box>
            </Flex>
            <Text className="text-muted-foreground text-sm mb-1">Click-through Rate</Text>
            <Heading as="h3" className="text-2xl font-bold">4.6%</Heading>
            <Text className="text-xs text-muted-foreground mt-1">vs. 4.2% previous period</Text>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <Flex className="items-start justify-between mb-4">
              <Box className="p-2 rounded-md bg-purple-500/10">
                <Clock className="h-5 w-5 text-purple-500" />
              </Box>
              <Box className="flex items-center text-sm">
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                <Text className="text-red-500 font-medium">-2.3%</Text>
              </Box>
            </Flex>
            <Text className="text-muted-foreground text-sm mb-1">Avg. Time on Page</Text>
            <Heading as="h3" className="text-2xl font-bold">1:48</Heading>
            <Text className="text-xs text-muted-foreground mt-1">vs. 1:52 previous period</Text>
          </CardContent>
        </Card>
      </Box>

      {/* Chart Area */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <Flex className="items-center justify-between mb-4">
            <Box>
              <Heading as="h3" className="text-lg font-semibold mb-1">Performance Metrics</Heading>
              <Text className="text-sm text-muted-foreground">Engagement, reach and clicks over time</Text>
            </Box>
            <Flex className="gap-2">
              <Button variant="outline" size="sm" className={dateRange === '7d' ? 'bg-muted' : ''} onClick={() => setDateRange('7d')}>
                7D
              </Button>
              <Button variant="outline" size="sm" className={dateRange === '30d' ? 'bg-muted' : ''} onClick={() => setDateRange('30d')}>
                30D
              </Button>
              <Button variant="outline" size="sm" className={dateRange === '90d' ? 'bg-muted' : ''} onClick={() => setDateRange('90d')}>
                90D
              </Button>
            </Flex>
          </Flex>
          
          {/* Chart visualization placeholder */}
          <Box className="bg-muted/30 border rounded-md p-4 h-[300px] flex items-center justify-center">
            <Box className="relative w-full h-full">
              {/* Y-axis labels */}
              <Box className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-muted-foreground pt-2 pb-8">
                <Text>4000</Text>
                <Text>3000</Text>
                <Text>2000</Text>
                <Text>1000</Text>
                <Text>0</Text>
              </Box>
              
              {/* Chart content */}
              <Flex className="absolute left-14 right-0 top-0 bottom-0 items-end pl-4">
                {performanceData.map((data, index) => (
                  <Flex key={data.month} className="flex-col items-center flex-1 justify-end h-full pb-8">
                    {/* Reach bar */}
                    <Box 
                      className="w-6 bg-blue-500/20 rounded-t-sm" 
                      style={{ height: `${(data.reach / 4000) * 100}%` }}
                    />
                    
                    {/* Clicks bar */}
                    <Box 
                      className="w-6 bg-amber-500/50 rounded-t-sm -mt-1" 
                      style={{ height: `${(data.clicks / 4000) * 100}%` }}
                    />
                    
                    {/* Engagement line point */}
                    <Box 
                      className="absolute w-2 h-2 rounded-full bg-primary"
                      style={{ 
                        bottom: `${(data.engagement / 100) * 100 + 32}px`, 
                        left: `${index * (100 / (performanceData.length - 1))}%`
                      }}
                    />
                    
                    {/* X-axis label */}
                    <Text className="text-xs text-muted-foreground mt-3">{data.month}</Text>
                  </Flex>
                ))}
                
                {/* Engagement line */}
                <Box className="absolute left-0 right-0 border-t border-dashed border-primary/50" 
                  style={{ bottom: `${(performanceData[3].engagement / 100) * 100 + 32}px` }} 
                />
              </Flex>
              
              {/* Legend */}
              <Flex className="absolute bottom-0 right-0 gap-4 text-xs">
                <Flex className="items-center">
                  <Box className="w-3 h-3 bg-blue-500/20 rounded-sm mr-1" />
                  <Text className="text-muted-foreground">Reach</Text>
                </Flex>
                <Flex className="items-center">
                  <Box className="w-3 h-3 bg-amber-500/50 rounded-sm mr-1" />
                  <Text className="text-muted-foreground">Clicks</Text>
                </Flex>
                <Flex className="items-center">
                  <Box className="w-3 h-3 bg-primary rounded-full mr-1" />
                  <Text className="text-muted-foreground">Engagement %</Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-6">
          <Flex className="items-center justify-between mb-4">
            <Box>
              <Heading as="h3" className="text-lg font-semibold mb-1">Campaign Performance</Heading>
              <Text className="text-sm text-muted-foreground">Track metrics across your marketing campaigns</Text>
            </Box>
            <Flex className="gap-2">
              <Box className="relative w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search campaigns..." 
                  className="pl-9"
                />
              </Box>
              <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>
                Filter
              </Button>
            </Flex>
          </Flex>
          
          {/* Table */}
          <Box className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left font-medium py-3 px-4">Campaign</th>
                  <th className="text-left font-medium py-3 px-4">Platform</th>
                  <th className="text-left font-medium py-3 px-4">Status</th>
                  <th className="text-right font-medium py-3 px-4">Engagement</th>
                  <th className="text-right font-medium py-3 px-4">Reach</th>
                  <th className="text-right font-medium py-3 px-4">Clicks</th>
                  <th className="text-right font-medium py-3 px-4">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">{campaign.name}</td>
                    <td className="py-3 px-4">{campaign.platform}</td>
                    <td className="py-3 px-4">
                      <Box 
                        className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
                          campaign.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-600' 
                            : campaign.status === 'ended' 
                            ? 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400' 
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Box>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Flex className="items-center justify-end">
                        {campaign.trend === 'up' ? (
                          <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                        ) : campaign.trend === 'down' ? (
                          <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                        ) : null}
                        {campaign.engagement}%
                      </Flex>
                    </td>
                    <td className="py-3 px-4 text-right">{campaign.reach.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{campaign.clicks.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{campaign.conversion}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          
          {/* Pagination */}
          <Flex className="items-center justify-between mt-4">
            <Text className="text-sm text-muted-foreground">Showing 1-4 of 4 campaigns</Text>
            <Flex className="gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </Flex>
          </Flex>
        </CardContent>
      </Card>
    </Box>
  )
} 