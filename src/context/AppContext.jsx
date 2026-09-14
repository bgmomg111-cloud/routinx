import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialSampleData = [
  {
    id: 'exp_1',
    type: 'expense',
    category: 'food',
    title: 'Organic Avocado Toast & Latte',
    amount: 14.50,
    currency: '$',
    date: new Date().toISOString().split('T')[0],
    time: '08:30',
    notes: 'Breakfast at Alpine Cafe',
    paymentMethod: 'Card'
  },
  {
    id: 'act_1',
    type: 'activity',
    category: 'trekking',
    title: 'Pine Ridge Trail Hike',
    duration: '2.5 hrs',
    distance: 8.4,
    elevation: 340,
    difficulty: 'Moderate',
    location: 'Emerald Valley Ridge',
    date: new Date().toISOString().split('T')[0],
    time: '09:45',
    notes: 'Sunny trail conditions, clear peak views.'
  },
  {
    id: 'exp_2',
    type: 'expense',
    category: 'drinks',
    title: 'Electrolyte Hydration Drinks',
    amount: 6.80,
    currency: '$',
    date: new Date().toISOString().split('T')[0],
    time: '12:30',
    notes: 'Trail refill',
    paymentMethod: 'Cash'
  }
];

const initialWaterLogs = [
  { id: 'w_1', amountMl: 500, time: '08:00', date: new Date().toISOString().split('T')[0] },
  { id: 'w_2', amountMl: 250, time: '10:30', date: new Date().toISOString().split('T')[0] },
  { id: 'w_3', amountMl: 750, time: '13:15', date: new Date().toISOString().split('T')[0] }
];

const initialWorkouts = [
  { id: 'wk_1', name: 'Barbell Squats & Deadlifts', category: 'Strength', sets: 4, reps: 10, weight: 80, duration: 45, calories: 320, time: '07:15', date: new Date().toISOString().split('T')[0] },
  { id: 'wk_2', name: '5K Morning Run', category: 'Cardio', sets: 0, reps: 0, weight: 0, duration: 25, calories: 240, time: '18:00', date: new Date().toISOString().split('T')[0] }
];

const initialHabits = [
  { id: 'hb_1', title: '🧘 15 Mins Morning Meditation', category: 'Wellness', streak: 5, completedDates: [new Date().toISOString().split('T')[0]] },
  { id: 'hb_2', title: '📖 Read 20 Pages of Book', category: 'Learning', streak: 3, completedDates: [new Date().toISOString().split('T')[0]] },
  { id: 'hb_3', title: '💧 2.5L Daily Hydration Goal', category: 'Health', streak: 7, completedDates: [] }
];

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('routinix_theme') || 'dark');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'hydration' | 'workouts' | 'habits' | 'analytics' | 'trekking'

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('routinix_logs');
    return saved ? JSON.parse(saved) : initialSampleData;
  });

  const [waterLogs, setWaterLogs] = useState(() => {
    const saved = localStorage.getItem('routinix_water_logs');
    return saved ? JSON.parse(saved) : initialWaterLogs;
  });

  const [waterGoal, setWaterGoal] = useState(() => {
    const saved = localStorage.getItem('routinix_water_goal');
    return saved ? parseInt(saved) : 2500;
  });

  const [waterUnit, setWaterUnit] = useState(() => {
    return localStorage.getItem('routinix_water_unit') || 'ml';
  });

  const [workoutLogs, setWorkoutLogs] = useState(() => {
    const saved = localStorage.getItem('routinix_workouts');
    return saved ? JSON.parse(saved) : initialWorkouts;
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('routinix_habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('routinix_settings');
    return saved ? JSON.parse(saved) : { currency: '$', dailyBudget: 100 };
  });

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pulseSignal, setPulseSignal] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('routinix_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('routinix_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('routinix_water_logs', JSON.stringify(waterLogs));
  }, [waterLogs]);

  useEffect(() => {
    localStorage.setItem('routinix_water_goal', waterGoal.toString());
  }, [waterGoal]);

  useEffect(() => {
    localStorage.setItem('routinix_water_unit', waterUnit);
  }, [waterUnit]);

  useEffect(() => {
    localStorage.setItem('routinix_workouts', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    localStorage.setItem('routinix_habits', JSON.stringify(habits));
  }, [habits]);

  const [expenseRemindersEnabled, setExpenseRemindersEnabled] = useState(() => {
    return localStorage.getItem('routinx_expense_reminders') === 'true';
  });

  const [notificationsSupported, setNotificationsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsSupported(true);
      if (Notification.permission === 'granted' && localStorage.getItem('routinx_expense_reminders') === 'true') {
        setExpenseRemindersEnabled(true);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('routinx_expense_reminders', expenseRemindersEnabled ? 'true' : 'false');
  }, [expenseRemindersEnabled]);

  const requestExpenseNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Native notifications are not supported in this browser.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setExpenseRemindersEnabled(true);
        new Notification('💸 RoutinX Expense Reminders Active', {
          body: 'Native reminders enabled! We will remind you to log meals, drinks, and travel expenses.',
          icon: '/routinx_3d_clock_icon.jpg'
        });
        return true;
      } else {
        setExpenseRemindersEnabled(false);
        return false;
      }
    } catch {
      return false;
    }
  };

  const sendTestExpenseNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('💳 RoutinX Daily Expense Reminder', {
        body: 'Keep your budget accurate! Log your food, drink, or travel expenses for today.',
        icon: '/routinx_3d_clock_icon.jpg'
      });
    } else {
      requestExpenseNotificationPermission();
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const trigger3DPulse = () => {
    setPulseSignal(prev => prev + 1);
  };

  const addLogEntry = (newEntry) => {
    setLogs(prev => [{ id: (newEntry.type === 'expense' ? 'exp_' : 'act_') + Date.now(), ...newEntry, currency: settings.currency }, ...prev]);
    trigger3DPulse();
  };

  const deleteLogEntry = (id) => {
    setLogs(prev => prev.filter(item => item.id !== id));
  };

  const addWaterEntry = (entry) => {
    setWaterLogs(prev => [{ id: 'w_' + Date.now(), ...entry }, ...prev]);
    trigger3DPulse();
  };

  const deleteWaterEntry = (id) => {
    setWaterLogs(prev => prev.filter(item => item.id !== id));
  };

  const addWorkoutEntry = (entry) => {
    setWorkoutLogs(prev => [{ id: 'wk_' + Date.now(), ...entry }, ...prev]);
    trigger3DPulse();
  };

  const deleteWorkoutEntry = (id) => {
    setWorkoutLogs(prev => prev.filter(item => item.id !== id));
  };

  const addHabit = (habit) => {
    setHabits(prev => [{ id: 'hb_' + Date.now(), ...habit, streak: 1, completedDates: [] }, ...prev]);
  };

  const toggleHabitCompletion = (id, dateStr) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const exists = h.completedDates && h.completedDates.includes(dateStr);
        const newDates = exists ? h.completedDates.filter(d => d !== dateStr) : [...(h.completedDates || []), dateStr];
        const newStreak = exists ? Math.max(0, h.streak - 1) : h.streak + 1;
        return { ...h, completedDates: newDates, streak: newStreak };
      }
      return h;
    }));
    trigger3DPulse();
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const resetToSampleData = () => {
    setLogs(initialSampleData);
    setWaterLogs(initialWaterLogs);
    setWorkoutLogs(initialWorkouts);
    setHabits(initialHabits);
  };

  const clearAllData = () => {
    setLogs([]);
    setWaterLogs([]);
    setWorkoutLogs([]);
    setHabits([]);
  };

  const exportDataJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '2.5.0',
      logs,
      waterLogs,
      waterGoal,
      waterUnit,
      workoutLogs,
      habits,
      settings
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `routinx_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.logs) setLogs(data.logs);
        if (data.waterLogs) setWaterLogs(data.waterLogs);
        if (data.waterGoal) setWaterGoal(data.waterGoal);
        if (data.waterUnit) setWaterUnit(data.waterUnit);
        if (data.workoutLogs) setWorkoutLogs(data.workoutLogs);
        if (data.habits) setHabits(data.habits);
        if (data.settings) setSettings(data.settings);
        alert('✅ Data imported successfully!');
      } catch {
        alert('❌ Invalid file format. Please use a valid RoutinX JSON backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      selectedDate,
      setSelectedDate,
      activeTab,
      setActiveTab,
      logs,
      addLogEntry,
      deleteLogEntry,
      waterLogs,
      addWaterEntry,
      deleteWaterEntry,
      waterGoal,
      setWaterGoal,
      waterUnit,
      setWaterUnit,
      workoutLogs,
      addWorkoutEntry,
      deleteWorkoutEntry,
      habits,
      addHabit,
      toggleHabitCompletion,
      deleteHabit,
      settings,
      setSettings,
      isQuickAddOpen,
      setIsQuickAddOpen,
      isSettingsOpen,
      setIsSettingsOpen,
      pulseSignal,
      resetToSampleData,
      clearAllData,
      exportDataJSON,
      importDataJSON,
      expenseRemindersEnabled,
      setExpenseRemindersEnabled,
      notificationsSupported,
      requestExpenseNotificationPermission,
      sendTestExpenseNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
