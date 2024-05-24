import {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import Calendar from '@/components/calendar/Calendar';
import {colors} from '@/constants';
import {getMonthYearDetails, getNewMonthYear} from '@/utils';
import useGetCalendarPosts from '@/hooks/queries/useGetCalendarPosts';
import EventList from '@/components/calendar/EventList';
import {ThemeMode} from '@/types';
import useThemeStore from '@/store/useThemeStore';

function CalendarHomeScreen() {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const currentMonthYear = getMonthYearDetails(new Date());
  const [monthYear, setMonthYear] = useState(currentMonthYear);
  const [selectedDate, setSelectedDate] = useState(0);
  const {
    data: posts,
    isPending,
    isError,
  } = useGetCalendarPosts(monthYear.year, monthYear.month);

  const moveToToday = () => {
    setSelectedDate(new Date().getDate());
    setMonthYear(getMonthYearDetails(new Date()));
  };

  useEffect(() => {
    moveToToday();
  }, []);

  if (isPending || isError) {
    return <></>;
  }

  const handlePressDate = (date: number) => {
    setSelectedDate(date);
  };

  const handleUpdateMonth = (increment: number) => {
    setMonthYear(prev => getNewMonthYear(prev, increment));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        monthYear={monthYear}
        schedules={posts}
        onChangeMonth={handleUpdateMonth}
        selectedDate={selectedDate}
        onPressDate={handlePressDate}
        moveToToday={moveToToday}
      />
      <EventList posts={posts[selectedDate]} />
    </SafeAreaView>
  );
}

const styling = (thmem: ThemeMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[thmem].WHITE,
    },
  });

export default CalendarHomeScreen;
