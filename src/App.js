import {useEffect, useState} from 'react';
import ReactApexChart from 'react-apexcharts'
import 'react-dropdown/style.css';
import Dropdown from './components/Dropdown';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Spinner from 'react-bootstrap/Spinner';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRefresh} from '@fortawesome/free-solid-svg-icons'

function App() {

    const [currentCount, setCurrentCount] = useState();
    const [minCount, setMinCount] = useState(0);
    const [maxCount, setMaxCount] = useState(0);

    const [buildingList, setBuildingList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [lessonList, setLessonList] = useState([]);
    const [dateList, setDateList] = useState([]);
    const [timeRangeList, setTimeRangeList] = useState([]);

    const [buildings, setBuildings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [allLessons, setAllLessons] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const [dates, setDates] = useState([]);
    const [buildingDates, setBuildingDates] = useState([]);
    const [roomDates, setRoomDates] = useState([]);

    const [filteredData, setFilteredData] = useState([]);
    const [comparedData, setComparedData] = useState([]);

    const [building, setBuilding] = useState();
    const [room, setRoom] = useState();
    const [lesson, setLesson] = useState();
    const [date, setDate] = useState();
    const [timeRange, setTimeRange] = useState();

    const [series, setSeries] = useState();
    const [options, setOptions] = useState();
    const [seriesCompare, setSeriesCompare] = useState();
    const [optionsCompare, setOptionsCompare] = useState();

    const [pieInSeries, setPieInSeries] = useState();
    const [pieInOptions, setPieInOptions] = useState();

    const [pieOutSeries, setPieOutSeries] = useState();
    const [pieOutOptions, setPieOutOptions] = useState();

    const [loadingOptions, setLoadingOptions] = useState(false);
    const [loadingTimes, setLoadingTimes] = useState(false);
    const [loadingGraph, setLoadingGraph] = useState(false);

    const [actualCount, setActualCount] = useState([]);

    const [periodTime, setPeriodTime] = useState('');
    const [monthState, setMonthState] = useState(false);
    const [semesterState, setSemesterState] = useState(false);

    const [comparedLesson, setComparedLesson] = useState();
    const [comparedLessonList, setComparedLessonList] = useState([]);
    const [menu, setMenu] = useState(false);

    const [periodTimeEnd, setPeriodTimeEnd] = useState('');

    const getDayId = (day) => {
        switch (day) {
            case "Sunday":
                return 0;
            case "Monday":
                return 1;
            case "Tuesday":
                return 2;
            case "Wednesday":
                return 3;
            case "Thursday":
                return 4;
            case "Friday":
                return 5;
            case "Saturday":
                return 6;
            default:
                console.log('day not defined')
        }
    }

    const correct_time = (date) => {
        return `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}`
    }

    const getData = () => {
        setLoadingOptions(true);
        fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/buildings`)
            .then((response) => response.json())
            .then((actualData) => setBuildings(actualData));

        fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/lessons`)
            .then((response) => response.json())
            .then((actualData) => setAllLessons(actualData));

        fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/semesters`)
            .then((response) => response.json())
            .then((actualData) => setSemesters(actualData));

        fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/buildings/actual`)
            .then((response) => response.json())
            .then((actualData) => setActualCount(actualData));
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        console.log(semesters);
    }, [semesters]);

    useEffect(() => {
        if (buildings) {
            let buildingOptions = []

            buildings.forEach(building => {
                const option = {label: building, value: building};
                buildingOptions.push(option);
            });

            setBuildingList(buildingOptions);
            setLoadingOptions(false);
        }
    }, [buildings]);

    useEffect(() => {
        setBuildingDates([]);
        setDates([]);
        setRooms([]);
        setRoom(null);
        if (building) {
            setLoadingOptions(true);
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/rooms/${building.value}`)
                .then((response) => response.json())
                .then((actualData) => setRooms(actualData));

            setLoadingTimes(true);
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/building/dates/${building.value}`)
                .then((response) => response.json())
                .then((actualData) => {
                    setDates(actualData);
                    setBuildingDates(actualData)
                });
        }
        setCurrentCount();
    }, [building]);

    useEffect(() => {
        if (rooms) {
            var roomOptions = []

            rooms.forEach(room => {
                const option = {label: room, value: room};
                roomOptions.push(option);
            });

            setRoomList(roomOptions);
            setLoadingOptions(false);
        }
    }, [rooms]);

    useEffect(() => {
        setRoomDates([]);
        if (building) setDates(buildingDates);
        setLessons([]);
        setLesson(null);
        if (room) {
            setLoadingTimes(true);
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/room/dates/${room.value}`)
                .then((response) => response.json())
                .then((actualData) => {
                    setDates(actualData);
                    setRoomDates(actualData)
                });
            setLoadingOptions(true);
            /*fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/lessons/${room.value}`)
                .then((response) => response.json())
                .then((actualData) => setLessons(actualData));*/

            const lessonsArray = []

            allLessons.forEach(lesson => {
                if (lesson.room === room.value) {
                    lessonsArray.push(lesson);
                }
            });

            setLessons(lessonsArray);
        }
        setCurrentCount();
    }, [room]);

    useEffect(() => {
        if (lessons) {
            var lessonOptions = []

            lessons.forEach(lesson => {
                const option = {
                    label: `${lesson.name} ${lesson.day} ${lesson.start_time}-${lesson.end_time}`,
                    value: lesson
                };
                lessonOptions.push(option);
            });
            setLessonList(lessonOptions);
            setLoadingOptions(false);
        }
    }, [lessons]);

    const addZero = (time) => {
        if (parseInt(time) < 10) {
            return '0' + time;
        } else {
            return time;
        }
    }

    const createAdditionalTime = (sub, plus) => {
        return `${addZero(sub.hour())}:${addZero(sub.minute())}-${addZero(plus.hour())}:${addZero(plus.minute())}`;
    }

    const setMonthPeriod = () => {
        if (monthState) {
            setPeriodTime('');
            setMonthState(false);
            setSeries(null);
            setOptions(null);
        } else {
            setMonthState(true);
            setSemesterState(false);
            var today = new Date();
            var priorDate = new Date(today.setMonth(today.getMonth() - 1));

            var dateOfPeriod = priorDate.getFullYear() + '-' + (priorDate.getMonth() + 1) + '-' + priorDate.getDate();


            today = new Date();
            var dateEndOfPeriod = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            setPeriodTime(dateOfPeriod);

            setPeriodTimeEnd(dateEndOfPeriod);
        }
    }

    const setSemesterPeriod = () => {
        if (semesterState) {
            setPeriodTime('');
            setSemesterState(false);
            setSeries(null);
            setOptions(null);
        } else {
            setSemesterState(true);
            setMonthState(false);
            var today = new Date();
            var dateOfStartSemester = null;
            var dateOfEndSemester = null;
            var minimum = null;

            semesters.forEach(semester => {

                const tempStartDate = new Date(semester.start_date);
                const tempEndDate = new Date(semester.end_date);

                console.log(tempStartDate <= today && tempEndDate >= today);
                console.log("-------");
                console.log(minimum === null || (today - tempEndDate < minimum && today - tempEndDate > 0));
                if (tempStartDate <= today && tempEndDate >= today) {
                    dateOfStartSemester = tempStartDate.getFullYear() + '-' + (tempStartDate.getMonth() + 1) + '-' + tempStartDate.getDate();
                    dateOfEndSemester = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                } else {
                    if ((minimum === null && today - tempEndDate > 0) || (today - tempEndDate < minimum && today - tempEndDate > 0)) {
                        console.log(today - tempEndDate);
                        minimum = today - tempEndDate;
                        dateOfStartSemester = tempStartDate.getFullYear() + '-' + (tempStartDate.getMonth() + 1) + '-' + tempStartDate.getDate();
                        dateOfEndSemester = tempEndDate.getFullYear() + '-' + (tempEndDate.getMonth() + 1) + '-' + tempEndDate.getDate();
                    }
                }
            })
            // var priorDate = new Date(today.setMonth(today.getMonth() - 1));
            //
            // var dateOfPeriod = priorDate.getFullYear() + '-' + (priorDate.getMonth() + 1) + '-' + priorDate.getDate();
            setPeriodTime(dateOfStartSemester);
            setPeriodTimeEnd(dateOfEndSemester);
        }
    }

    const timer = (startTime, endTime) => {
        var arrayStartTime = startTime.split(":");
        var arrayEndTime = endTime.split(":");

        var startHour = arrayStartTime[0];
        var startMinute = arrayStartTime[1];

        var endHour = arrayEndTime[0];
        var endMinute = arrayEndTime[1];

        const startDate = moment.utc()
            .hour(parseInt(startHour))   // numbers from 0 to 23
            .minute(parseInt(startMinute)).second(0); // numbers from 0 to 59

        const endDate = moment.utc()
            .hour(parseInt(endHour))   // numbers from 0 to 23
            .minute(parseInt(endMinute)).second(0); // numbers from 0 to 59

        const sub5Min = startDate.clone().add(-5, 'm');
        const sub10Min = startDate.clone().add(-10, 'm');
        const sub15Min = startDate.clone().add(-15, 'm');

        const plus5Min = endDate.clone().add(5, 'm');
        const plus10Min = endDate.clone().add(10, 'm');
        const plus15Min = endDate.clone().add(15, 'm');

        const obj5 = {
            start_time: sub5Min.hour() + ":" + sub5Min.minute(),
            end_time: plus5Min.hour() + ":" + plus5Min.minute()
        }

        const obj10 = {
            start_time: sub10Min.hour() + ":" + sub10Min.minute(),
            end_time: plus10Min.hour() + ":" + plus10Min.minute()
        }

        const obj15 = {
            start_time: sub15Min.hour() + ":" + sub15Min.minute(),
            end_time: plus15Min.hour() + ":" + plus15Min.minute()
        }

        const option5 = {
            label: createAdditionalTime(sub5Min, plus5Min),
            value: obj5
        };

        const option10 = {
            label: createAdditionalTime(sub10Min, plus10Min),
            value: obj10
        };

        const option15 = {
            label: createAdditionalTime(sub15Min, plus15Min),
            value: obj15
        };

        setTimeRangeList([option5, option10, option15]);
    }

    useEffect(() => {
        if (!periodTime) {
            setComparedLesson(null);
        }
        updateFilteredData();
    }, [periodTime])

    useEffect(() => {
        if (room) setDates(roomDates);
        if (lesson) {
            setLoadingTimes(true);
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/lesson/dates/${room.value}/${getDayId(lesson.value.day)}`)
                .then((response) => response.json())
                .then((actualData) => {
                    setDates(actualData);
                });
            timer(lesson.value.start_time, lesson.value.end_time);

            var lessonOptions = []

            allLessons.forEach(item => {
                if (item.name !== lesson.value.name) {
                    const option = {
                        label: `${item.name} ${item.day} ${item.start_time}-${item.end_time}`,
                        value: item
                    };
                    lessonOptions.push(option);
                }
            });

            setComparedLessonList(lessonOptions);
        } else {
            setPeriodTime('');
            setSemesterState(false);
            setMonthState(false);
        }
        setComparedLesson(null);
        setCurrentCount();
    }, [lesson]);

    useEffect(() => {
        updateFilteredData();
        setCurrentCount();
    }, [date]);

    useEffect(() => {
        if (dates) {
            setDate(null);
            if (!date) updateFilteredData();

            //  dates.forEach(date => {
            //       console.log(date);
            //       const option = {label: ${date.day}-${date.month}-${date.year}, value: date};
            //       datesOptions.push(option);
            //   });
            //
            //   setDateList(datesOptions);
            var arrayDate = [];
            dates.forEach(date => {
                arrayDate.push(new Date(`${date.year}-${date.month}-${date.day}`));
            })
            setDateList(arrayDate);
            console.log(dates)
            setLoadingTimes(false);
        }
    }, [dates]);

    useEffect(() => {
        if (comparedLesson) {
            setTimeRange(null);
            updateFilteredData();
        } else {
            setSeriesCompare(null);
            setOptionsCompare(null);
        }
    }, [comparedLesson]);

    useEffect(() => {
        if (comparedData) {
            renderPeriodGraph(comparedData, setSeriesCompare, setOptionsCompare, comparedLesson);
        }
    }, [comparedData]);

    const updateFilteredData = () => {
        if (!date) {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
        }

        // console.log(building);
        // console.log(room);
        setLoadingGraph(true);
        if (building && !room && !lesson) {
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/building/${date ? date.getFullYear() : yyyy}-${date ? date.getMonth() + 1 : mm}-${date ? date.getDate() : dd}/${building.value}`)
                .then((response) => response.json())
                .then((actualData) => setFilteredData(actualData));
        } else if (room && building && !lesson) {
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/room/${date ? date.getFullYear() : yyyy}-${date ? date.getMonth() + 1 : mm}-${date ? date.getDate() : dd}/${room.value}`)
                .then((response) => response.json())
                .then((actualData) => setFilteredData(actualData));
        } else if (lesson && building && room && dates) {
            if (comparedLesson) {
                fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/lesson/period/${room.value}/${periodTime}/${periodTimeEnd}/${getDayId(comparedLesson.value.day)}`)
                    .then((response) => response.json())
                    .then((actualData) => setComparedData(actualData));
            }
            if (periodTime && periodTimeEnd) {
                console.log(periodTimeEnd);
                fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/lesson/period/${room.value}/${periodTime}/${periodTimeEnd}/${getDayId(lesson.value.day)}`)
                    .then((response) => response.json())
                    .then((actualData) => setFilteredData(actualData));
            } else {
                fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/room/${date ? date.getFullYear() : dates[dates.length - 1].year}-${date ? date.getMonth() + 1 : dates[dates.length - 1].month}-${date ? date.getDate() : dates[dates.length - 1].day}/${room.value}`)
                    .then((response) => response.json())
                    .then((actualData) => setFilteredData(actualData));
            }
        } else {
            setFilteredData([]);
        }
    }

    useEffect(() => {
        updateFilteredData();
    }, [timeRange]);

    const renderPeriodGraph = (data, setSeries, setOptions, lesson) => {
        var count = 0;
        var today = new Date();
        if (lesson && dates) {
            var start_date;
            var end_date;
            var selectedStartTime = lesson.value.start_time;
            var selectedEndTime = lesson.value.end_time;

            if (timeRange) {
                selectedStartTime = timeRange.value.start_time;
                selectedEndTime = timeRange.value.end_time;
            }


            var finalArray = [];

            var tmp_min = false;
            var tmp_prev_count = 0;
            var tmp_next_count = 0;
            data.forEach((element, index) => {
                tmp_min = false;
                var dateData = new Date(element.date);
                start_date = new Date(`${dateData.getFullYear()}-${dateData.getMonth() + 1}-${dateData.getDate()} ${selectedStartTime}`)
                end_date = new Date(`${dateData.getFullYear()}-${dateData.getMonth() + 1}-${dateData.getDate()} ${selectedEndTime}`)
                tmp_prev_count = 0;
                count = 0;
                finalArray[index] = {date: element.date, device_data: []};
                element.device_data.forEach((item) => {
                    const date = new Date(item.date);
                    count = count + (item.diff_in - item.diff_out);

                    if (date >= start_date && tmp_min === false) {
                        tmp_min = true;
                        const time = correct_time(start_date);
                        finalArray[index].device_data.push({
                            time: new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${time}`).getTime(),
                            count: tmp_prev_count
                        });

                    }
                    tmp_prev_count = count;
                })
                if (finalArray[index].device_data.length === 0) {
                    const time = correct_time(start_date);
                    finalArray[index].device_data.push({
                        time: new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${time}`).getTime(),
                        count: 0
                    })
                }
            })

            var tempIndexElement = 0;

            tmp_min = false;    //in this case this is tmp max
            data.forEach((element, index) => {
                tmp_next_count = 0;
                var dateData = new Date(element.date);
                count = 0;
                start_date = new Date(`${dateData.getFullYear()}-${dateData.getMonth() + 1}-${dateData.getDate()} ${selectedStartTime}`)
                end_date = new Date(`${dateData.getFullYear()}-${dateData.getMonth() + 1}-${dateData.getDate()} ${selectedEndTime}`)
                element.device_data.forEach((item, indexElement) => {
                    const date = new Date(item.date);
                    count = count + (item.diff_in - item.diff_out);
                    if (date >= start_date && date <= end_date) {

                        tmp_next_count = count;
                        // deviceIdsObjects.forEach(obj => {
                        //     if (element.device_id === obj.device_id) {
                        //         obj.in = obj.in + element.device_data.diff_in;
                        //         obj.out = obj.out + element.device_data.diff_out;
                        //     }
                        // })
                        const time = correct_time(date);
                        finalArray[index].device_data.push({
                            time: new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${time}`).getTime(),
                            count: count
                        });

                        tempIndexElement = indexElement;
                    }

                })

                const time = correct_time(end_date);
                finalArray[index].device_data.push({
                    time: new Date(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${time}`).getTime(),
                    count: tmp_next_count
                });
            });

            var array = [];

            finalArray.forEach((item, index) => {
                array[index] = {name: item.date, data: []}
                item.device_data.forEach((element) => {
                    array[index].data.push([element.time, element.count])
                })
            })

            setSeries(array)
            setOptions({
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: true
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: (lesson && (lesson.value.building + " | " + lesson.value.room + " | " + lesson.value.name)),
                    align: 'left'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        formatter: function (timestamp) {
                            return new Date(timestamp).toLocaleTimeString() // The formatter function overrides format property
                        },
                    }
                }
            });
        }
    }

    useEffect(() => {
        setLoadingGraph(false);
        setMinCount();
        setMaxCount();
        if (filteredData.length !== 0) {
            if (periodTime) {
                renderPeriodGraph(filteredData, setSeries, setOptions, lesson);
            } else {
                var deviceIds = [];
                var deviceIdsObjects = [];
                var count = 0;
                var min = null;
                var max = 0;
                filteredData.forEach(element => {
                    if (deviceIds.indexOf(element.device_id) === -1) {
                        deviceIds.push(element.device_id);
                        const obj = {
                            device_id: element.device_id,
                            in: 0,
                            out: 0
                        }
                        deviceIdsObjects.push(obj);
                    }
                });
                count = 0;
                const counts = [];
                const times = [];
                if (lesson && dates) {
                    var start_date;
                    var end_date;
                    var selectedStartTime = lesson.value.start_time;
                    var selectedEndTime = lesson.value.end_time;

                    if (timeRange) {
                        selectedStartTime = timeRange.value.start_time;
                        selectedEndTime = timeRange.value.end_time;
                    }

                    if (date) {
                        start_date = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${selectedStartTime}`)
                        end_date = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${selectedEndTime}`)
                    } else {
                        start_date = new Date(`${dates[dates.length - 1].year}-${dates[dates.length - 1].month}-${dates[dates.length - 1].day} ${selectedStartTime}`)
                        end_date = new Date(`${dates[dates.length - 1].year}-${dates[dates.length - 1].month}-${dates[dates.length - 1].day} ${selectedEndTime}`)
                    }
                    var tmp_min = false;
                    var tmp_prev_count = 0;
                    var tmp_next_count = null;
                    filteredData.forEach((element) => {
                        const date = new Date(element.sample_time);
                        count = count + (element.device_data.diff_in - element.device_data.diff_out);

                        if (date >= start_date && tmp_min === false) {
                            if (min > tmp_prev_count || min == null) {
                                min = tmp_prev_count;
                            }

                            if (max < tmp_prev_count) {
                                max = tmp_prev_count;
                            }
                            tmp_min = true;
                            const time = correct_time(start_date);
                            times.push(time);
                            counts.push(tmp_prev_count);
                        }
                        tmp_prev_count = count;
                    })
                    count = 0;
                    tmp_min = false;    //in this case this is tmp max
                    filteredData.forEach((element) => {
                        const date = new Date(element.sample_time);
                        count = count + (element.device_data.diff_in - element.device_data.diff_out);
                        if (date >= start_date && date <= end_date) {
                            if (min > count || min == null) {
                                min = count;
                            }

                            if (max < count) {
                                max = count;
                            }
                            tmp_next_count = count;
                            deviceIdsObjects.forEach(obj => {
                                if (element.device_id === obj.device_id) {
                                    obj.in = obj.in + element.device_data.diff_in;
                                    obj.out = obj.out + element.device_data.diff_out;
                                }
                            })
                            const time = correct_time(date);
                            counts.push(count);
                            times.push(time);
                        }
                    });
                    counts.push(tmp_next_count);
                    const time = correct_time(end_date);
                    times.push(time);
                } else {
                    filteredData.forEach(element => {
                        deviceIdsObjects.forEach(obj => {
                            if (element.device_id === obj.device_id) {
                                obj.in = obj.in + element.device_data.diff_in;
                                obj.out = obj.out + element.device_data.diff_out;
                            }
                        })
                        const date = new Date(element.sample_time);
                        count = count + (element.device_data.diff_in - element.device_data.diff_out);
                        if (min > count || min == null) {
                            min = count;
                        }

                        if (max < count) {
                            max = count;
                        }
                        counts.push(count);
                        const time = correct_time(date);
                        times.push(time);
                    });
                    setCurrentCount(counts[(counts.length) - 1]);
                }

                var text = '';

                if (building) {
                    text = text + building.value;
                    if (room) {
                        text = text + " | " + room.value;
                        if (lesson) {
                            text = text + " | " + lesson.value.name;
                        }
                    }
                    if (date) {
                        text = text + " | " + (addZero(date.getDate()) + "-" + addZero(date.getMonth() + 1) + "-" + date.getFullYear())
                    } else {
                        text = text + " | " + (addZero(dates[dates.length - 1].day) + "-" + addZero(dates[dates.length - 1].month) + "-" + dates[dates.length - 1].year)
                    }
                }

                setMinCount(min);
                setMaxCount(max);

                setSeries([{
                    name: "Count",
                    data: counts
                }
                ])
                setOptions({
                    chart: {
                        height: 350,
                        type: 'line',
                        zoom: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'straight'
                    },
                    title: {
                        text: text,
                        align: 'left'
                    },
                    grid: {
                        row: {
                            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                            opacity: 0.5
                        },
                    },
                    xaxis: {
                        categories: times,
                    }
                });

                var seriesIns = []
                var seriesOuts = []
                var options = []

                deviceIdsObjects.forEach(obj => {
                    seriesIns.push(obj.in);
                    seriesOuts.push(obj.out);
                    options.push("Door " + obj.device_id);
                });

                if (deviceIds.length > 1) {
                    setPieInSeries(seriesIns)
                    setPieInOptions({
                        chart: {
                            width: 380,
                            type: 'pie',
                        },
                        labels: options,
                        title: {
                            text: 'In',
                            align: 'left'
                        },
                        responsive: [{
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200
                                },
                                legend: {
                                    position: 'bottom'
                                }
                            }
                        }]
                    })

                    setPieOutSeries(seriesOuts)
                    setPieOutOptions({
                        chart: {
                            width: 380,
                            type: 'pie',
                        },
                        labels: options,
                        title: {
                            text: 'Out',
                            align: 'left'
                        },
                        responsive: [{
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200
                                },
                                legend: {
                                    position: 'bottom'
                                }
                            }
                        }]
                    })
                } else {
                    setPieInSeries(null);
                    setPieInOptions(null);
                    setPieOutSeries(null);
                    setPieOutOptions(null);
                }
            }
        } else {
            setSeries(null);
            setOptions(null);
            setPieInSeries(null);
            setPieInOptions(null);
            setPieOutSeries(null);
            setPieOutOptions(null);
        }
    }, [filteredData]);

    return <>
        <div className='container'>
            <div className={menu ? 'navbar-container-active' : 'navbar-container'}>
                <div className='navbar-menu'>
                    <div className='refresh-mobile'>
                        <button className='refresh-button' onClick={updateFilteredData}><FontAwesomeIcon
                            icon={faRefresh}
                            size={"2x"}/></button>
                    </div>
                    <div className='menu-icon-container'>
                        <div className='menu-icon' onClick={() => setMenu(!menu)}>
                            <div className="bar1"></div>
                            <div className="bar2"></div>
                            <div className="bar3"></div>
                        </div>
                    </div>
                </div>
                <div className='navbar-items'>
                    <div className='navbar-item'>
                        <div className="small-navbar">
                            <div className="navbar-label"><b>Building</b></div>
                        </div>
                        <div className="small-dropdown">
                            <Dropdown selected={building && building.label} defaultLabel={"Building"}
                                      options={buildingList}
                                      onChange={setBuilding}/>
                        </div>

                        <div className="normal-dropdown">
                            <Dropdown selected={building && building.label} defaultLabel={""} options={buildingList}
                                      onChange={setBuilding}/>
                        </div>
                    </div>
                    <div className='navbar-item'>
                        <div className="small-navbar">
                            <div className="navbar-label"><b>Room</b></div>
                        </div>
                        <div className="small-dropdown">
                            <Dropdown selected={room && room.label} defaultLabel={"Room"} options={roomList}
                                      onChange={setRoom}/>
                        </div>
                        <div className="normal-dropdown">
                            <Dropdown selected={room && room.label} defaultLabel={""} options={roomList}
                                      onChange={setRoom}/>
                        </div>

                    </div>
                    <div className='navbar-item'>
                        <div className="small-navbar">
                            <div className="navbar-label"><b>Lesson</b></div>
                        </div>
                        <div className="small-dropdown">
                            <Dropdown selected={lesson && lesson.label} defaultLabel={"Lesson"} options={lessonList}
                                      onChange={setLesson}/>
                        </div>
                        <div className="normal-dropdown">
                            <Dropdown selected={lesson && lesson.label} defaultLabel={""} options={lessonList}
                                      onChange={setLesson}/>
                        </div>
                    </div>
                    <div className='navbar-item'>
                        <div className="navbar-label"><b>Date</b></div>
                        <div className='date-picker'>
                            <DatePicker selected={date} onChange={(date) => {
                                setDate(date);
                            }} includeDates={dateList}/>
                        </div>
                    </div>
                </div>
            </div>

            {(loadingOptions || loadingGraph || loadingTimes) &&
            <div className='loading-spinner'>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
            }

            <div className="counts">
                {!date && !lesson && building && currentCount &&
                <div className="currentCount">
                    <div className="alert alert-info" role="alert">
                        <h4 className="alert-heading">Current attendees</h4>
                        <h1>{currentCount}</h1>
                    </div>
                </div>
                }

                {building && (maxCount || maxCount === 0) &&
                <div className="currentCount">
                    <div className="alert alert-info" role="alert">
                        <h4 className="alert-heading">Maximum attendees</h4>
                        <h1>{maxCount}</h1>
                    </div>
                </div>
                }

                {building && (minCount || minCount === 0) &&
                <div className="currentCount">
                    <div className="alert alert-info" role="alert">
                        <h4 className="alert-heading">Minimum attendees</h4>
                        <h1>{minCount}</h1>
                    </div>
                </div>
                }
            </div>

            <div className='refresh-desktop'>
                <button className='refresh-button' onClick={updateFilteredData}><FontAwesomeIcon icon={faRefresh}
                                                                                                 size={"2x"}/></button>
            </div>

            {series && options && lesson &&
            <div className='timePeriodChangeSmall'>
                <button className={monthState ? 'timePeriodChangeButton active' : 'timePeriodChangeButton'}
                        onClick={setMonthPeriod}>Month
                </button>
                <button className={semesterState ? 'timePeriodChangeButton active' : 'timePeriodChangeButton'}
                        onClick={setSemesterPeriod}>Semester
                </button>
            </div>}


            <div className='graphs'>
                {series && options &&
                <div className="graph">
                    <ReactApexChart options={options} series={series} type="line" height={350}/>
                </div>
                }
                {seriesCompare && optionsCompare &&
                <div className="graph">
                    <ReactApexChart options={optionsCompare} series={seriesCompare} type="line" height={350}/>
                </div>
                }
                {series && options && lesson &&
                <div className='additionalOptions'>
                    <div className='timePeriodChange'>
                        <button className={monthState ? 'timePeriodChangeButton active' : 'timePeriodChangeButton'}
                                onClick={setMonthPeriod}>Month
                        </button>
                        <button className={semesterState ? 'timePeriodChangeButton active' : 'timePeriodChangeButton'}
                                onClick={setSemesterPeriod}>Semester
                        </button>
                    </div>
                    <div className='options'>
                        {!comparedLesson &&
                        <div className='options-item'>
                            {lesson &&
                            <Dropdown time={true} selected={timeRange && timeRange.label} defaultLabel={"Time range"}
                                      options={timeRangeList}
                                      onChange={setTimeRange}/>}
                        </div>
                        }
                        {periodTime &&
                        <div className='options-item'>
                            <Dropdown selected={comparedLesson && comparedLesson.label} defaultLabel={"Compare with"}
                                      options={comparedLessonList}
                                      onChange={setComparedLesson}/>
                        </div>
                        }
                    </div>
                </div>
                }
                <div className="piecharts">
                    {pieInSeries && pieInOptions &&
                    <ReactApexChart className="piechart" options={pieInOptions} series={pieInSeries} type="pie"/>
                    }
                    {pieOutSeries && pieOutOptions &&
                    <ReactApexChart className="piechart" options={pieOutOptions} series={pieOutSeries} type="pie"/>
                    }
                </div>
            </div>


            {/*series && options && room && !lesson && <div>
            <ReactApexChart options={options} series={series} type="line" height={350}/>
            <div className="piecharts">
                <ReactApexChart options={options} series={series[0].data} type="pie" height={350} width={300}/>
                <ReactApexChart options={options} series={series[0].data} type="pie" height={350} width={300}/>
            </div>

        </div>

    */}
            <div className='row'>
                {!building && !room && !lesson &&
                buildings.map(item => (
                    // <div class="col">{building.value}</div>
                    <div className="col-6 col-md-4 building" key={item.building}>
                        <div className="card">
                            <img src="https://www.iconpacks.net/icons/1/free-building-icon-1062-thumb.png"
                                 className="card-img-top" alt="..."></img>
                            <div className="card-body">
                                <h5 className="card-title">{item}</h5>
                                <p className="card-text" style={{fontStyle: "italic"}}>
                                    Current number of people</p>
                                <p className="card-text"
                                   style={{fontSize: "20px"}}>{actualCount.find(building => building.building === item) ? actualCount.find(building => building.building === item).count : 0}</p>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    </>
}

export default App;
