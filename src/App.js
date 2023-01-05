import {useEffect, useState} from 'react';
import ReactApexChart from 'react-apexcharts'
import 'react-dropdown/style.css';
import Dropdown from './components/Dropdown';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons'

function App() {

    const [currentCount, setCurrentCount] = useState();
    const [minCount, setMinCount] = useState();
    const [maxCount, setMaxCount] = useState();

    const [buildingList, setBuildingList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [lessonList, setLessonList] = useState([]);
    const [dateList, setDateList] = useState([]);
    const [timeRangeList, setTimeRangeList] = useState([]);

    const [buildings, setBuildings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [lessons, setLessons] = useState([]);

    const [dates, setDates] = useState([]);
    const [buildingDates, setBuildingDates] = useState([]);
    const [roomDates, setRoomDates] = useState([]);

    const [filteredData, setFilteredData] = useState([]);

    const [building, setBuilding] = useState();
    const [room, setRoom] = useState();
    const [lesson, setLesson] = useState();
    const [date, setDate] = useState();
    const [timeRange, setTimeRange] = useState();

    const [series, setSeries] = useState();
    const [options, setOptions] = useState();

    const [pieInSeries, setPieInSeries] = useState();
    const [pieInOptions, setPieInOptions] = useState();

    const [pieOutSeries, setPieOutSeries] = useState();
    const [pieOutOptions, setPieOutOptions] = useState();

    const [loadingOptions, setLoadingOptions] = useState(false);
    const [loadingTimes, setLoadingTimes] = useState(false);
    const [loadingGraph, setLoadingGraph] = useState(false);



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

    const getBuildings = () => {
        setLoadingOptions(true);
        fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/buildings`)
            .then((response) => response.json())
            .then((actualData) => setBuildings(actualData));
    };

    useEffect(() => {
        getBuildings();
    }, []);

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
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/lessons/${room.value}`)
                .then((response) => response.json())
                .then((actualData) => setLessons(actualData));
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
            label: `${sub5Min.hour()}:${sub5Min.minute()}-${plus5Min.hour()}:${plus5Min.minute()}`,
            value: obj5
        };

        const option10 = {
            label: `${sub10Min.hour()}:${sub10Min.minute()}-${plus10Min.hour()}:${plus10Min.minute()}`,
            value: obj10
        };

        const option15 = {
            label: `${sub15Min.hour()}:${sub15Min.minute()}-${plus15Min.hour()}:${plus15Min.minute()}`,
            value: obj15
        };

        setTimeRangeList([option5, option10, option15]);
    }

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
        }
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
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/room/${date ? date.getFullYear() : dates[dates.length - 1].year}-${date ? date.getMonth() + 1 : dates[dates.length - 1].month}-${date ? date.getDate() : dates[dates.length - 1].day}/${room.value}`)
                .then((response) => response.json())
                .then((actualData) => setFilteredData(actualData));
        } else {
            setFilteredData([]);
        }
    }

    useEffect(() =>{
        updateFilteredData();
    },[timeRange]);

    useEffect(() => {
        setLoadingGraph(false);
        setMinCount();
        setMaxCount();
        if (filteredData.length !== 0) {
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
                    text: 'Attendee',
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
                options.push(obj.device_id);
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
            <div className='navbar-container'>
                <div className='navbar-item'>
                    <div className="navbar-label"><b>Building</b></div>
                    <Dropdown selected={building && building.label} defaultLabel={""} options={buildingList}
                        onChange={setBuilding}/>
                </div>
                <div className='navbar-item'>
                    <div className="navbar-label"><b>Room</b></div>
                    <Dropdown selected={room && room.label} defaultLabel={""} options={roomList} onChange={setRoom}/>
                </div>
                <div className='navbar-item'>
                    <div className="navbar-label"><b>Lesson</b></div>
                    <Dropdown selected={lesson && lesson.label} defaultLabel={""} options={lessonList} onChange={setLesson}/>
                </div>
                <div className='navbar-item'>
                    <div className="navbar-label"><b>Date</b></div>
                    <div className='date-picker'>
                        <DatePicker selected={date} onChange={(date) => {
                            setDate(date);
                        }} includeDates={dateList}/>
                    </div>
                </div>
                <div className='navbar-item'>
                    {lesson && <div className="navbar-label"><b>Time</b></div>}
                    {lesson &&
                        <Dropdown selected={timeRange && timeRange.label} defaultLabel={""} options={timeRangeList}
                        onChange={setTimeRange}/>}
                </div>
            </div>

            { (loadingOptions || loadingGraph || loadingTimes) &&
                <div className='loading-spinner'>
                    <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            }

        <div className="counts">
            {!date && !lesson && building && currentCount &&
                <div className="currentCount">
                    <div className="alert alert-success" role="alert">
                        <h4 className="alert-heading">Current attendees</h4>
                        <h1>{currentCount}</h1>
                    </div>
                </div>
            }

            {building && maxCount &&
                <div className="currentCount">
                    <div className="alert alert-success" role="alert">
                        <h4 className="alert-heading">Maximum attendees</h4>
                        <h1>{maxCount}</h1>
                    </div>
                </div>
            }

            {building && minCount &&
                <div className="currentCount">
                    <div className="alert alert-success" role="alert">
                        <h4 className="alert-heading">Minimum attendees</h4>
                        <h1>{minCount}</h1>
                    </div>
                </div>
            }
        </div>

        <div className='refresh'>
            <button className='refresh-button' onClick={updateFilteredData}><FontAwesomeIcon icon={faRefresh} size={"2x"} /></button>
        </div>

        <div className='graphs'>
            {series && options &&
            <div className="graph">
                <ReactApexChart options={options} series={series} type="line" height={350}/>
            </div>
            }
            <div className="piecharts">
                {pieInSeries && pieInOptions &&
                <ReactApexChart options={pieInOptions} series={pieInSeries} type="pie" width={380}/>
                }
                {pieOutSeries && pieOutOptions &&
                <ReactApexChart options={pieOutOptions} series={pieOutSeries} type="pie" width={380}/>
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
        <div className='buildings'>

                {!building && !room && !lesson &&
                buildingList.map(building => (
                    // <div class="col">{building.value}</div>
                    <div className="building" key={building.value}>
                        <div className="card">
                            <img src="https://www.iconpacks.net/icons/1/free-building-icon-1062-thumb.png"
                                 className="card-img-top" alt="..."></img>
                            <div className="card-body">
                                <h5 className="card-title">{building.value}</h5>
                                <p className="card-text">There will be number of people inside</p>
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
