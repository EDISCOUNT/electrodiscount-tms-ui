



export function getMinDate(dates: Date[]): Date | null {
    if (dates.length === 0) {
      return null;
    }
  
    return new Date(Math.min(...dates.map(date => date.getTime())));
  }
  
  export function getMaxDate(dates: Date[]): Date | null {
    if (dates.length === 0) {
      return null;
    }
  
    return new Date(Math.max(...dates.map(date => date.getTime())));
  }
  
  
  export function dateArrayDifference(arr1: Date[], arr2: Date[]): Date[] {
    const dateSet2 = new Set(arr2.map(date => date.getTime()));
    const difference = arr1.filter(date => !dateSet2.has(date.getTime()));
    return difference;
  }
  
  export function getFurthestDate(targetDate: Date, dateArray: Date[]): Date | null {
    if (dateArray.length === 0) {
      return null;
    }
  
    const furthestDate = dateArray.reduce((previous, current) => {
      const previousDiff = Math.abs(previous.getTime() - targetDate.getTime());
      const currentDiff = Math.abs(current.getTime() - targetDate.getTime());
      return currentDiff > previousDiff ? current : previous;
    }, dateArray[0]);
  
    return furthestDate;
  }


  export function buildDateLabel(date?: Date){
    if(!date){
        return '00-00-00';
    }
    return date.toLocaleDateString();
  }
  