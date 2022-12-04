import {useEffect, useState} from 'react';
import ReactApexChart from 'react-apexcharts'
import 'react-dropdown/style.css';
import Dropdown from './components/Dropdown';

function App() {

    const [data, setData] = useState();
    const [lessonsData, setLessonsData] = useState();

    const [buildingList, setBuildingList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [lessonList, setLessonList] = useState([]);
    const [dateList, setDateList] = useState([]);

    const [buildings, setBuildings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [dates, setDates] = useState([]);
    const [buildingDates, setBuildingDates] = useState([]);
    const [roomDates, setRoomDates] = useState([]);
    const [lessonDates, setLessonDates] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [test, setTest] = useState();

    const [building, setBuilding] = useState();
    const [room, setRoom] = useState();
    const [lesson, setLesson] = useState();
    const [date, setDate] = useState();

    const [series, setSeries] = useState();
    const [options, setOptions] = useState();

    const getDayName = (day) => {
        switch (day) {
            case 0:
                return "Sunday";
            case 1:
                return "Monday";
            case 2:
                return "Tuesday";
            case 3:
                return "Wednesday";
            case 4:
                return "Thursday";
            case 5:
                return "Friday";
            case 6:
                return "Saturday";
            default:
                console.log('day not defined')
        }
    }

    const getData = () => {
        fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/`)
            .then((response) => response.json())
            .then((actualData) => setData(actualData));
    };

    const getBuildings = () => {
        fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/buildings`)
            .then((response) => response.json())
            .then((actualData) => setBuildings(actualData));
    };

    const getLessons = () => {
        fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/lessons`)
            .then((response) => response.json())
            .then((actualData) => setLessonsData(actualData));
    };

    const updateFilteredData = () => {
        if (!date) {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
        }

        // console.log(building);
        // console.log(room);

        if (building && !room && !lesson) {
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/building/${date ? date.value.year : yyyy}-${date ? date.value.month : mm}-${date ? date.value.day : dd}/${building.value}`)
                .then((response) => response.json())
                .then((actualData) => setFilteredData(actualData));
        } else if (room && building && !lesson) {
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/room/${date ? date.value.year : yyyy}-${date ? date.value.month : mm}-${date ? date.value.day : dd}/${room.value}`)
                .then((response) => response.json())
                .then((actualData) => setFilteredData(actualData));
        } else if (lesson && building && room) {
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/room/${date ? date.value.year : yyyy}-${date ? date.value.month : mm}-${date ? date.value.day : dd}/${room.value}`)
                .then((response) => response.json())
                .then((actualData) => setFilteredData(actualData));
        } else {
            setFilteredData([]);
        }
    }

    useEffect(() => {
        getData();
        getLessons();
        getBuildings();
    }, []);

    useEffect(() => {
        if (buildings) {
            var buildingOptions = []

            buildings.forEach(building => {
                const option = {label: building, value: building};
                buildingOptions.push(option);
            });

            setBuildingList(buildingOptions);
        }
    }, [buildings]);

    useEffect(() => {
        if(!room){
          setDate(null);
          if(!date) updateFilteredData();
        }
        setBuildingDates([]);
        setDates([]);
        setRooms([]);
        setRoom(null);
        if (building) {
            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/rooms/${building.value}`)
                .then((response) => response.json())
                .then((actualData) => setRooms(actualData));

            fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/building/dates/${building.value}`)
                .then((response) => response.json())
                .then((actualData) => {
                    setDates(actualData);
                    setBuildingDates(actualData)
                });
        }
    }, [building]);

    useEffect(() => {
        if (rooms) {
            var roomOptions = []

            rooms.forEach(room => {
                const option = {label: room, value: room};
                roomOptions.push(option);
            });

            setRoomList(roomOptions);
        }
    }, [rooms]);

    useEffect(() => {
        if (dates) {
            var datesOptions = []

            dates.forEach(date => {
                const option = {label: `${date.day}-${date.month}-${date.year}`, value: date};
                datesOptions.push(option);
            });

            setDateList(datesOptions);
        }
    }, [dates]);

    useEffect(() => {
        updateFilteredData();
    }, [date]);

    useEffect(() => {
      if(!lesson){
        setDate(null);
        if(!date) updateFilteredData();
      }
      setRoomDates([]);
      if(building) setDates(buildingDates);
      setLessons([]);
      setLesson(null);
      if (room) {
          fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/room/dates/${room.value}`)
              .then((response) => response.json())
              .then((actualData) => {
                  setDates(actualData);
                  setRoomDates(actualData)
              });

          fetch(`https://xhai158pwa.execute-api.eu-central-1.amazonaws.com/Prod/lessons/${room.value}`)
              .then((response) => response.json())
              .then((actualData) => setLessons(actualData));
      }
    }, [room]);

    useEffect(() => {
        setDate(null);
        if(!date) updateFilteredData();
        if(room) setDates(roomDates);
        if (lesson) {
            // var dates = []
            //
            // data.forEach(element => {
            //     const date = new Date(element.sample_time);
            //     const dateObject = {
            //         year: date.getFullYear(),
            //         month: date.getMonth() + 1,
            //         day: date.getDate()
            //     }
            //
            //     if (JSON.stringify(dates[dates.length - 1]) !== JSON.stringify(dateObject) && element.device_data.building === building.value && element.device_data.room === room.value && getDayName(date.getDay()) === lesson.value.day) {
            //         dates.push(dateObject);
            //     }
            // });
            //
            // var datesOptions = []
            //
            // dates.forEach(date => {
            //     const option = {label: `${date.day}-${date.month}-${date.year}`, value: date};
            //     datesOptions.push(option);
            // });
            //
            // setDateList(datesOptions);
        }
    }, [lesson]);

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
        }
    }, [lessons]);

    useEffect(() => {
        if (filteredData.length !== 0) {
            const counts = []
            var count = 0
            const times = []
            filteredData.forEach(element => {
                const date = new Date(element.sample_time);
                count = count + (element.device_data.diff_in - element.device_data.diff_out);
                counts.push(count);
                const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                times.push(time);
            });

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
        } else {
            setSeries(null);
            setOptions(null);
        }
    }, [filteredData]);

    return <>
        <div className="navbarLabels">
            <ul className="liNavbarLabels">
                <li className="liNavbarLabels"><b>Building</b></li>
                <li className="liNavbarLabels"><b>Room</b></li>
                <li className="liNavbarLabels"><b>Lesson</b></li>
                <li className="liNavbarLabels"><b>Date</b></li>
            </ul>
        </div>
        <div className="dropdownBarQ">
            <Dropdown selected={building && building.label} defaultLabel={""} options={buildingList}
                      onChange={setBuilding}/>
            <Dropdown selected={room && room.label} defaultLabel={""} options={roomList} onChange={setRoom}/>
            <Dropdown selected={lesson && lesson.label} defaultLabel={""} options={lessonList} onChange={setLesson}/>
            <Dropdown selected={date && date.label} defaultLabel={""} options={dateList} onChange={setDate}/>
        </div>
        {series && options &&
        <ReactApexChart options={options} series={series} type="line" height={350}/>
        }
        <div className='indexFrame'>
            <div className="row row-cols-1 row-cols-md-3 g-4">

                {!building && !room && !lesson &&
                buildingList.map(building => (
                    // <div class="col">{building.value}</div>
                    <div className="col" key={building.value}>
                        <div className="card w-50">
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
