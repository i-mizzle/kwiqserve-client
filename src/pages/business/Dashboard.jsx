import React, { useEffect, useState } from 'react'
import AppLayout from '../../components/Layouts/AppLayout'
import { useDispatch } from 'react-redux'
import Loader from '../../components/elements/Loader'
import { SET_SUCCESS } from '../../store/types'
import { authHeader, baseUrl } from '../../utils'
import axios from 'axios'

const Dashboard = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [summaryRange, setSummaryRange] = useState('day')
  const [channelRange, setChannelRange] = useState('day')
  
  useEffect(() => {
    
    const fetchDashboardStats = async () => {
      try {
        const headers = authHeader()
        setLoading(true)
        const response = await axios.get(`${baseUrl}/dashboard/stats`, {headers})
        setStats(response.data.data)
      } catch (error) {
        console.log('fetch stats error: ', error.response.data)
        dispatch({
          type: SET_SUCCESS,
          error
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  const formatCurrency = (value) => `₦${(value || 0).toLocaleString()}`
  const getPercentage = (value) => Number(value || 0)

  // const placeholderStats = {
  //   metrics: {
  //     todayOrdersCount: 12,
  //     todayOrdersValue: 184000,
  //     thisWeekOrdersCount: 86,
  //     thisWeekOrdersValue: 942500,
  //     thisMonthOrdersCount: 318,
  //     thisMonthOrdersValue: 4287500,
  //     soldItems: [
  //       { name: 'Jollof bowl', quantity: 42, salesValue: 210000, image: '' },
  //       { name: 'Chicken wrap', quantity: 28, salesValue: 168000, image: '' },
  //       { name: 'Berry smoothie', quantity: 19, salesValue: 95000, image: '' }
  //     ],
  //     mostSoldItem: {
  //       name: 'Jollof bowl',
  //       quantity: 42,
  //       salesValue: 210000,
  //       image: ''
  //     },
  //     closedUnpaidOrdersCount: 4,
  //     closedUnpaidOrdersValue: 56000,
  //     unpaidOrdersValue: 142000,
  //     currentYearOrdersValue: 18450000,
  //     unpaidOrdersCount: 11,
  //     percentageDailyChange: 8.2,
  //     percentageWeeklyChange: -3.4,
  //     percentageMonthlyChange: 12.6
  //   },
  //   transactionsSummary: {
  //     daySummary: [
  //       { day: 'Sunday, 2/18/2026', amount: 42000, percentage: '15.0' },
  //       { day: 'Monday, 2/19/2026', amount: 68000, percentage: '24.0' },
  //       { day: 'Tuesday, 2/20/2026', amount: 52000, percentage: '18.0' },
  //       { day: 'Wednesday, 2/21/2026', amount: 74000, percentage: '26.0' },
  //       { day: 'Thursday, 2/22/2026', amount: 28000, percentage: '10.0' },
  //       { day: 'Friday, 2/23/2026', amount: 32000, percentage: '12.0' },
  //       { day: 'Saturday, 2/24/2026', amount: 58000, percentage: '20.0' }
  //     ],
  //     weekSummary: [
  //       { week: '1/20/2026', amount: 210000, percentage: '40.0' },
  //       { week: '1/27/2026', amount: 178000, percentage: '34.0' },
  //       { week: '2/3/2026', amount: 134000, percentage: '26.0' }
  //     ],
  //     monthSummary: [
  //       { month: 'Dec', amount: 325000, percentage: '28.0' },
  //       { month: 'Jan', amount: 412000, percentage: '36.0' },
  //       { month: 'Feb', amount: 408000, percentage: '36.0' }
  //     ]
  //   },
  //   transactionsByChannel: {
  //     currentDay: { cash: 28000, pos: 41000, transfer: 15000 },
  //     currentWeek: { cash: 112000, pos: 230000, transfer: 98000 },
  //     currentMonth: { cash: 498000, pos: 1240000, transfer: 620000 }
  //   }
  // }

  const viewStats = stats

  const summaryData = summaryRange === 'day'
    ? viewStats?.transactionsSummary?.daySummary
    : summaryRange === 'week'
    ? viewStats?.transactionsSummary?.weekSummary
    : viewStats?.transactionsSummary?.monthSummary

  const channelData = channelRange === 'day'
    ? viewStats?.transactionsByChannel?.currentDay
    : channelRange === 'week'
    ? viewStats?.transactionsByChannel?.currentWeek
    : viewStats?.transactionsByChannel?.currentMonth

  const ChangeBadge = ({ value, label }) => {
    const numericValue = getPercentage(value)
    const positive = numericValue >= 0
    return (
      <div className={`inline-flex items-center gap-x-1 rounded-full px-2 py-1 text-[11px] font-medium ${positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${positive ? 'bg-green-100' : 'bg-red-100'}`}>
          <svg viewBox="0 0 20 20" className={`h-3 w-3 ${positive ? 'text-green-600' : 'text-red-600'}`} fill="currentColor">
            <path d={positive ? 'M5 12l5-5 5 5' : 'M5 8l5 5 5-5'} />
          </svg>
        </span>
        <span>{Math.abs(numericValue).toFixed(2)}%</span>
        <span className='text-gray-400'>{label}</span>
      </div>
    )
  }

  const Sparkline = ({ value, index }) => {
    const numericValue = Math.max(1, Math.min(100, getPercentage(value)))
    const seed = index + numericValue
    const points = Array.from({ length: 6 }).map((_, i) => {
      const wave = Math.sin((i + seed) * 0.9) * 3
      const level = 12 - (numericValue / 100) * 6 - wave
      const y = Math.max(2, Math.min(12, Math.round(level)))
      return `${i * 6},${y}`
    })

    return (
      <svg viewBox="0 0 30 14" className='h-4 w-10' fill="none">
        <polyline points={points.join(' ')} stroke="#1E3A8A" strokeWidth="1.6" fill="none" />
      </svg>
    )
  }

  const BarChartIcon = () => (
    <svg viewBox="0 0 20 20" className='h-5 w-5 text-ss-dark-blue' fill="currentColor">
      <path d="M4 14h2V8H4v6zm5 0h2V4H9v10zm5 0h2V10h-2v4z" />
    </svg>
  )
  
  return (
    <AppLayout pageTitle="Dashboard">
        <div className='w-11/12 mx-auto mt-6'>
          {loading ? 
            <Loader />
            :
            <div className='min-h-screen h-inherit'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h1 className='text-2xl sm:text-3xl font-bold text-ss-dark-gray'>Business dashboard</h1>
                  <p className='text-gray-500 text-sm'>Track sales performance, orders, and payment activity.</p>
                </div>
              </div>
              
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5'>
                <div className='bg-white rounded-lg border border-gray-100 p-4 sm:p-5'>
                  <p className='text-xs uppercase tracking-wide text-gray-400'>Today</p>
                  <h3 className='text-2xl font-semibold text-ss-dark-gray mt-2'>{viewStats?.metrics?.todayOrdersCount || 0} orders</h3>
                  <p className='text-sm text-gray-500 mt-1'>Value</p>
                  <h3 className='text-lg font-medium text-gray-700'>{formatCurrency(viewStats?.metrics?.todayOrdersValue)}</h3>
                  <div className='mt-3'>
                    <ChangeBadge value={viewStats?.metrics?.percentageDailyChange} label="vs yesterday" />
                  </div>
                </div>
                
                <div className='bg-white rounded-lg border border-gray-100 p-4 sm:p-5'>
                  <p className='text-xs uppercase tracking-wide text-gray-400'>This week</p>
                  <h3 className='text-2xl font-semibold text-ss-dark-gray mt-2'>{viewStats?.metrics?.thisWeekOrdersCount || 0} orders</h3>
                  <p className='text-sm text-gray-500 mt-1'>Value</p>
                  <h3 className='text-lg font-medium text-gray-700'>{formatCurrency(viewStats?.metrics?.thisWeekOrdersValue)}</h3>
                  <div className='mt-3'>
                    <ChangeBadge value={viewStats?.metrics?.percentageWeeklyChange} label="vs last week" />
                  </div>
                </div>
                
                <div className='bg-white rounded-lg border border-gray-100 p-4 sm:p-5'>
                  <p className='text-xs uppercase tracking-wide text-gray-400'>This month</p>
                  <h3 className='text-2xl font-semibold text-ss-dark-gray mt-2'>{viewStats?.metrics?.thisMonthOrdersCount || 0} orders</h3>
                  <p className='text-sm text-gray-500 mt-1'>Value</p>
                  <h3 className='text-lg font-medium text-gray-700'>{formatCurrency(viewStats?.metrics?.thisMonthOrdersValue)}</h3>
                  <div className='mt-3'>
                    <ChangeBadge value={viewStats?.metrics?.percentageMonthlyChange} label="vs last month" />
                  </div>
                </div>
              </div>
              
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mt-6'>
                <div className='bg-white rounded-lg border border-gray-100 p-4 sm:p-5'>
                  <p className='text-sm text-gray-500'>Closed unpaid orders</p>
                  <h3 className='text-2xl font-semibold text-ss-dark-gray mt-2'>{viewStats?.metrics?.closedUnpaidOrdersCount || 0}</h3>
                  <p className='text-sm text-gray-500 mt-1'>Value</p>
                  <h3 className='text-lg font-medium text-gray-700'>{formatCurrency(viewStats?.metrics?.closedUnpaidOrdersValue)}</h3>
                </div>
                
                <div className='bg-white rounded-lg border border-gray-100 p-4 sm:p-5'>
                  <p className='text-sm text-gray-500'>Unpaid orders</p>
                  <h3 className='text-2xl font-semibold text-ss-dark-gray mt-2'>{viewStats?.metrics?.unpaidOrdersCount || 0}</h3>
                  <p className='text-sm text-gray-500 mt-1'>Total unpaid value</p>
                  <h3 className='text-lg font-medium text-gray-700'>{formatCurrency(viewStats?.metrics?.unpaidOrdersValue)}</h3>
                </div>
                
                <div className='bg-white rounded-lg border border-gray-100 p-4 sm:p-5'>
                  <p className='text-sm text-gray-500'>Year to date</p>
                  <h3 className='text-2xl font-semibold text-ss-dark-gray mt-2'>{formatCurrency(viewStats?.metrics?.currentYearOrdersValue)}</h3>
                  <p className='text-xs text-gray-400 mt-1'>Total paid order value</p>
                </div>
              </div>
              
              <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8'>
                <div className='xl:col-span-2 bg-white rounded-lg border border-gray-100 p-4 sm:p-6'>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4'>
                    <div className='flex items-center gap-x-2'>
                      <BarChartIcon />
                      <div>
                        <h2 className='text-lg font-semibold text-ss-dark-gray'>Transactions summary</h2>
                        <p className='text-sm text-gray-500'>Total amounts grouped by day, week, or month.</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-x-2 bg-gray-100 rounded-lg p-1 w-max'>
                      {['day', 'week', 'month'].map((range) => (
                        <button
                          key={range}
                          onClick={() => setSummaryRange(range)}
                          className={`px-3 py-1.5 text-xs rounded-md transition duration-200 ${summaryRange === range ? 'bg-ss-dark-blue text-white' : 'text-gray-600 hover:bg-white'}`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className='space-y-4'>
                    {summaryData?.map((item, index) => (
                      <div key={index} className='flex flex-col gap-y-2'>
                        <div className='flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600'>
                          <span>{item.day || item.week || item.month}</span>
                          <div className='flex items-center gap-x-3'>
                            <Sparkline value={item.percentage} index={index} />
                            <span className='font-medium text-gray-700'>{formatCurrency(item.amount)}</span>
                          </div>
                        </div>
                        <div className='w-full h-2 bg-gray-100 rounded-full'>
                          <div
                            className='h-2 rounded-full bg-ss-dark-blue'
                            style={{ width: `${Math.min(100, getPercentage(item.percentage))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    
                    {(!summaryData || summaryData?.length === 0) && (
                      <div className='py-6 text-center text-sm text-gray-400'>No transactions summary yet.</div>
                    )}
                  </div>
                </div>
                
                <div className='bg-white rounded-lg border border-gray-100 p-4 sm:p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div>
                      <h2 className='text-lg font-semibold text-ss-dark-gray'>Transactions by channel</h2>
                      <p className='text-sm text-gray-500'>Channel split for the selected period.</p>
                    </div>
                  </div>
                  
                  <div className='flex items-center gap-x-2 bg-gray-100 rounded-lg p-1 w-max mb-5'>
                    {['day', 'week', 'month'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setChannelRange(range)}
                        className={`px-3 py-1.5 text-xs rounded-md transition duration-200 ${channelRange === range ? 'bg-ss-dark-blue text-white' : 'text-gray-600 hover:bg-white'}`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                  
                  <div className='space-y-3'>
                    {Object.entries(channelData || {}).map(([channel, amount]) => (
                      <div key={channel} className='flex items-center justify-between text-sm text-gray-600'>
                        <span className='capitalize'>{channel.replace('_', ' ')}</span>
                        <h3 className='font-medium text-gray-700'>{formatCurrency(amount.amount)}</h3>
                      </div>
                    ))}
                    
                    {Object.keys(channelData || {}).length === 0 && (
                      <div className='py-6 text-center text-sm text-gray-400'>No channel data yet.</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8'>
                <div className='bg-white rounded-lg border border-gray-100 p-4 sm:p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div>
                      <h2 className='text-lg font-semibold text-ss-dark-gray'>Most sold item</h2>
                      <p className='text-sm text-gray-500'>Top performing item for the current period.</p>
                    </div>
                  </div>
                  
                  <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                    <div className='w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center'>
                      {viewStats?.metrics?.mostSoldItem?.image ? (
                        <img src={viewStats?.metrics?.mostSoldItem?.image} alt={viewStats?.metrics?.mostSoldItem?.name || 'Most sold'} className='w-full h-full object-cover' />
                      ) : (
                        <span className='text-xs text-gray-400'>No image</span>
                      )}
                    </div>
                    <div>
                      <p className='text-lg font-semibold text-ss-dark-gray'>
                        {viewStats?.metrics?.mostSoldItem?.name || 'No item yet'}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {viewStats?.metrics?.mostSoldItem?.quantity || 0} sold
                      </p>
                      <p className='text-sm text-gray-700 mt-1'>
                        {formatCurrency(viewStats?.metrics?.mostSoldItem?.salesValue)} total sales
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className='bg-white rounded-lg border border-gray-100 p-4 sm:p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div>
                      <h2 className='text-lg font-semibold text-ss-dark-gray'>Sold items</h2>
                      <p className='text-sm text-gray-500'>Latest items that recorded sales.</p>
                    </div>
                  </div>
                  
                  <div className='space-y-3'>
                    {viewStats?.metrics?.soldItems?.length > 0 ? (
                      viewStats.metrics.soldItems.map((item, index) => (
                        <div key={index} className='flex items-center justify-between text-sm text-gray-600'>
                          <div className='flex items-center gap-x-3'>
                            <div className='w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center'>
                              {item?.image ? (
                                <img src={item.image} alt={item?.name} className='w-full h-full object-cover' />
                              ) : (
                                <span className='text-[10px] text-gray-400'>No image</span>
                              )}
                            </div>
                            <div>
                              <p className='text-gray-700 font-medium'>{item?.name || 'Unnamed item'}</p>
                              <p className='text-xs text-gray-400'>{item?.quantity || 0} sold</p>
                            </div>
                          </div>
                          <span className='font-medium text-gray-700'>{formatCurrency(item?.salesValue)}</span>
                        </div>
                      ))
                    ) : (
                      <div className='py-6 text-center text-sm text-gray-400'>No items sold yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
    </AppLayout>
  )
}

export default Dashboard