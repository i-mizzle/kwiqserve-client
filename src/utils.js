import { nanoid } from 'nanoid';

export const baseUrl = import.meta.env.VITE_API_URL;

export const convertCamelCase = (camelCaseText) => {
    const text = camelCaseText;
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    return finalResult
}

export const tableHeadersFields = (sampleObject) => {
    if(!sampleObject) {
        return []
    }
    const headers = []
    const fields = []
    Object.keys(sampleObject).forEach((key, index)=>{
        let columnDataType = 'text'
        let forPopover = false
        let columnDisplayName = convertCamelCase(key)
        let sortable = false
        let column = key

        headers.push({
            column,
            columnDisplayName,
            data: sampleObject[key],
            sortable,
            forPopover,
            columnDataType
        })

        let fieldSelected = true

        if(index > 10) {
            fieldSelected = false
        }
        fields.push({
            name: columnDisplayName,
            selected: fieldSelected
        })
    });
    return {headers, fields}
}

export const isValidObject = (obj) => {
    return obj && obj !== 'null' && obj !== 'undefined';
}

export const slugify = (string) => {
    if (!string || string === '' ) {
        return ""
    }
    const updated = string.toLowerCase()
    const slugified = updated.split(' ').join('-')

    return slugified
}

export const unSlugify = (string) => {
    if(!string || string === '') {
        return
    }
    return string.replace(/[_-]/g, " "); 
    // return string.replace(/[^0-9_-]/g, ' ')
}

export const formatPhone = (phone) => {
    let formatted =""
    if (!phone || phone === '') {
        return ""
    }

    if (phone.charAt(0) === '0') {
        formatted = '+234' + phone.substring(1)
    } else {
        formatted = phone
    }

    return formatted
}

export const clientId = () => {
    const client = JSON.parse(localStorage.getItem('clientId'));
    if (!client || client === '') {
        const newClient = nanoid(25)
        localStorage.setItem("clientId", JSON.stringify(newClient));
        return newClient
    } else {
      return client;
    }
}

export const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.authToken) {
        return {
            Authorization: 'Bearer ' + user.authToken, 
            "x-original-host": window && window.location.host 
        };
    } else {
      return {};
    }
}

export const hasPermissions = (requiredPermissions) => {
    const user = JSON.parse(localStorage.getItem('user'));
    // const currentStore = JSON.parse(localStorage.getItem('currentStore'));
    // const userStore = user.stores.find(store => store.store.toString() === currentStore._id.toString())

    // const userPermissions = JSON.parse(localStorage.getItem('userPermissions'));
    const userPermissions = user.permissions
    return requiredPermissions.some(permission =>
        userPermissions?.includes(permission)
    );
}

export const businessDetails = () => {
    const business = JSON.parse(localStorage.getItem('currentBusiness'));
    return business
}

// export const storeDetails = () => {
//     const store = JSON.parse(localStorage.getItem('currentBusiness'));
//     return store
// }

export const userDetails = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user
}

export const storeSubscription = () => {
    const subscription = JSON.parse(localStorage.getItem('activeSubscription'));
    return subscription
}

export const parseFilters = (filtersArray) => {
    if(!filtersArray || filtersArray.length === 0) {
        return ''
    }

    let filtersString = filtersArray.map((filterObject) => {
        let string = 'filter='
        for (const [, value] of Object.entries(filterObject)) {
            string += `${value}||`
          }
        return string.slice(0, -2)
    })

    return filtersString.join('&').toString()
} 

export const toTimeStamp = (date) => {
    const dateObj = new Date(date)
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    const time = dateObj.getUTCHours() + ':' + dateObj.getUTCMinutes() + ':' + dateObj.getUTCSeconds()
    const timeStamp = `${month}/${day}/${year} @ ${time}`
    return timeStamp
}

export const sortArrayByObjectKey = (array, key, direction) => {
    if(!array || !key) {
        return
    }

    function SortArray(x, y){
        if(direction === 'ASC') {
            return x[key].localeCompare(y[key]);
        } else {
            return y[key].localeCompare(x[key]);
        }
    }

    var s = array.sort(SortArray);

    return s
}

const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
} 
  
export const formatDate = (date) => {
return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
].join('-');
}

import countryStates from './assets/static/country-states.json'
import { StatesLgas } from './assets/static/stateslgas';

export const parseNigerianStates = () => {
    const statesArray = []
    for (const [key, value] of Object.entries(countryStates.NG.divisions)) {
        statesArray.push({
            label: value,
            value: key
        })
    }

    return statesArray
}

export const stateCities = (state)  => {
    const states = StatesLgas
    const cities = states.find(st => st.stateSlug === slugify(state))
    return cities?.lgas || []
}

export const generateCode = (length, isNumeric) => {
    if (!isNumeric) { isNumeric = false }
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    if (isNumeric) {
        characters = '0123456789';
    }
    var charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const searchArray = (array, searchQuery) => {
    // Convert the searchQuery to lowercase for case-insensitive search
    const query = searchQuery.toLowerCase().trim();

    // Filter the array based on the search query
    return array.filter((item) => {
        // Check each field in the object for likeness
        for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
                const value = item[key]?.toString()?.toLowerCase();
                if (value?.includes(query)) {
                    return true; // Found a match in this object
                }
            }
        }
        return false; // No match found in this object
    });
}

export const paginateArray = (array, page, pageSize) => {
    // Calculate the starting and ending indexes for the current page
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Return a slice of the array for the current page
    return array.slice(startIndex, endIndex);
}

export const debounce = (func, timeout = 1000) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
    };
}

// Helper function to check if a date is within the current month
export const isDateInCurrentMonth = (date) => {
    const currentDate = new Date();
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
}
  
  // Helper function to check if a date is within the current week
export const isDateInCurrentWeek = (date) => {
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return date >= oneWeekAgo && date <= currentDate;
}

export const listLowStockVariants = (inventory) => {
    const lowStockVariants = [];

    inventory.forEach((item) => {
        if(item.type === 'sale') {
            item.variants.forEach((variant) => {
                if (variant.currentStock < variant.lowStockAlertCount) {
                    const lowStockInfo = {
                        id: item._id,
                        itemName: item.name,
                        variantName: variant.name,
                        currentStock: variant.currentStock,
                        saleUnit: variant.saleUnit,
                    };
                    lowStockVariants.push(lowStockInfo);
                }
            });
        }
        if(item.type === 'store') {
            if (item.currentStock < item.lowStockAlertCount) {
                const lowStockInfo = {
                    id: item._id,
                    itemName: item.name,
                    variantName: '',
                    currentStock: item.currentStock,
                    saleUnit: item.stockUnit,
                };
                lowStockVariants.push(lowStockInfo);
            }
        }
    });

    return lowStockVariants;
}

export const getTransactionSummary = (transactions) => {
    const today = new Date();
    const past10Days = [];
    const past10Weeks = [];
    const past10Months = [];
    const dayTransactions = {};
    const weekTransactions = {};
    const monthTransactions = {};
  
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      past10Days.push(date);
    }
  
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - 7 * i);
      past10Weeks.push(date);
    }
  
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      past10Months.push(date);
    }
  
    past10Days.forEach((date) => {
      const dayKey = date.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
      dayTransactions[dayKey] = { day: dayKey, amount: 0, transactionsByChannel: {} };
    });
  
    past10Weeks.forEach((date) => {
      const weekKey = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      weekTransactions[weekKey] = {
        week: weekKey,
        amount: 0,
        transactionsByChannel: {},
      };
    });
  
    past10Months.forEach((date) => {
      const monthKey = date.toLocaleString('en-US', { month: 'short' });
      monthTransactions[monthKey] = {
        month: monthKey,
        amount: 0,
        transactionsByChannel: {},
      };
    });
  
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.dateCreated);
      const dayKey = transactionDate.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
      const weekKey = `${transactionDate.getMonth() + 1}/${transactionDate.getDate()}/${transactionDate.getFullYear()}`;
      const monthKey = transactionDate.toLocaleString('en-US', { month: 'short' });
  
      if (dayTransactions[dayKey]) {
        dayTransactions[dayKey].amount += transaction.amount;
        if (!dayTransactions[dayKey].transactionsByChannel[transaction.channel]) {
          dayTransactions[dayKey].transactionsByChannel[transaction.channel] = 0;
        }
        dayTransactions[dayKey].transactionsByChannel[transaction.channel] += transaction.amount;
      }
  
      if (weekTransactions[weekKey]) {
        weekTransactions[weekKey].amount += transaction.amount;
        if (!weekTransactions[weekKey].transactionsByChannel[transaction.channel]) {
          weekTransactions[weekKey].transactionsByChannel[transaction.channel] = 0;
        }
        weekTransactions[weekKey].transactionsByChannel[transaction.channel] += transaction.amount;
      }
  
      if (monthTransactions[monthKey]) {
        monthTransactions[monthKey].amount += transaction.amount;
        if (!monthTransactions[monthKey].transactionsByChannel[transaction.channel]) {
          monthTransactions[monthKey].transactionsByChannel[transaction.channel] = 0;
        }
        monthTransactions[monthKey].transactionsByChannel[transaction.channel] += transaction.amount;
      }
    });
  
    const daySummary = Object.values(dayTransactions);
    const weekSummary = Object.values(weekTransactions);
    const monthSummary = Object.values(monthTransactions);
  
    return {
      daySummary,
      weekSummary,
      monthSummary,
    };
  }
  
export const calculateMetrics = (orders) => {
    let todayOrdersCount = 0;
    let todayOrdersValue = 0;
    let thisMonthOrdersCount = 0;
    let thisMonthOrdersValue = 0;
    const soldItems = {};
    let closedUnpaidOrdersCount = 0;
    let unpaidOrdersValue = 0;
    let currentYearOrdersValue = 0;
    let mostSoldItem = { name: '', quantity: 0 }; // Initialize mostSoldItem

    for (const order of orders) {
        const { total, dateCreated, status, paymentStatus, orderItems } = order;
        const orderDate = new Date(dateCreated);

        // Task 1: Total orders today and this month
        if (status === 'COMPLETED' && isDateInCurrentMonth(orderDate)) {
            thisMonthOrdersCount++;
            thisMonthOrdersValue += total;

            if (isDateInCurrentWeek(orderDate)) {
                todayOrdersCount++;
                todayOrdersValue += total;
            }

            // Task 3: Track sold items and find the most sold item
            for (const item of orderItems) {
                const { itemName, quantity } = item;
                if (soldItems[itemName]) {
                soldItems[itemName] += quantity;
                if (soldItems[itemName] > mostSoldItem.quantity) {
                    mostSoldItem.name = itemName;
                    mostSoldItem.quantity = soldItems[itemName];
                }
                } else {
                soldItems[itemName] = quantity;
                if (quantity > mostSoldItem.quantity) {
                    mostSoldItem.name = itemName;
                    mostSoldItem.quantity = quantity;
                }
                }
            }
        }

        // Task 4: Count closed, unpaid orders
        if (status === 'CLOSED' && paymentStatus === 'UNPAID') {
            closedUnpaidOrdersCount++;
        }

        // Task 5: Count unpaid orders and their total value
        if (paymentStatus === 'UNPAID') {
            unpaidOrdersValue += total;
        }

        // Calculate total value of orders in the current year
        if (orderDate.getFullYear() === new Date().getFullYear()) {
            currentYearOrdersValue += total;
        }
    }
    return {
        todayOrdersCount,
        todayOrdersValue,
        thisMonthOrdersCount,
        thisMonthOrdersValue,
        soldItems,
        mostSoldItem,
        closedUnpaidOrdersCount,
        unpaidOrdersValue,
        currentYearOrdersValue
    }
    
}

export const returnDocuments = (array) => {
    return array.map(item => {
        if(item.document) {
            let document = item.document
            if(item._id){
                document._id = item._id
            }
            return document
        }
    })
}

export const orderTotal = (orderDetails, storeSettings) => {
    const totalPrice = orderDetails?.items?.reduce((a, b) => a + (b.price * b.quantity || 0), 0)
    let vat = 0

    if(storeSettings?.taxes && storeSettings?.taxes?.enabled === true){
        vat = totalPrice * (storeSettings?.taxes?.rate)
    }

    // console.log('________', totalPrice)

    return {total: totalPrice, vat: vat}
}

const itemPriceMinusVat = (storeSettings, price) => {
    const finalPrice = (price / (1 + (storeSettings?.taxes?.rate/100))).toFixed(2)
    return finalPrice
}

export const itemQuantityPriceMultiplier = (storeSettings, price) => {
    return storeSettings?.taxes && storeSettings?.taxes?.enabled ? itemPriceMinusVat(storeSettings, price) : price
}

/**
 * Calculate fee amount based on payment amount
 * Fee is 1.5% of the payment amount, capped at 1000
 * @param paymentAmount - The total payment amount
 * @returns The calculated fee amount
 */
export const calculateFee = (paymentAmount) => {
  const feePercentage = 0.015; // 1.5%
  const maxFee = 1000;
  
  const calculatedFee = paymentAmount * feePercentage;
  
  return Math.min(calculatedFee, maxFee);
}