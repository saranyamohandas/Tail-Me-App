import React, { Component } from 'react';
import "../../index.css";
import FullCalendar from 'fullcalendar-reactwrapper';
import 'fullcalendar/dist/fullcalendar.css';
import API from "../../utils/API";
import WalkerScheduleWalks from "../../components/WalkerScheduleWalks";

class Schedule extends Component {
    state = {
        date: new Date(),
        events: []
    };

    componentDidMount() {
        this.loadMyWalks();
    };

    loadMyWalks = () => {
        console.log("username", this.props.username)
        const idWalker = this.props.walkerID
        API.getMyWalks(idWalker)
            .then(res => {
                const dataFormat = res.data.map(data => {
                    console.log("checkin", data.checkInTime)
                    const dataFormatted = {
                        start: data.walkDate,
                        end: data.checkOutTime,
                        title: data.dogOwner.dogName,
                        id: data.id
                    }
                    return (dataFormatted)
                });
                console.log("Data Format", dataFormat)
                this.setState({ events: dataFormat })
            })
            .catch(err => console.log(err));
    }

    handleDropEvent(event) {
        console.log(event.id)
        console.log(event.start)
        const data = {
            walkDate: event.start
        }
        API.updateWalk(event.id, data)
            .then(res => {

            })
            .catch(err => console.log(err));
    }

    render() {
        return (

            <div id="example-component">

                <div>
                    <br></br>
                    <WalkerScheduleWalks
                        walkerID={this.props.walkerID}
                        username={this.props.username}
                    />
                </div>

                <div className="calenderContainer">
                    <div className="fullCalender" id="example-component">
                        <FullCalendar
                            id="your-custom-ID"
                            header={{
                                left: 'prev,next today myCustomButton',
                                center: 'title',
                                right: 'month,agendaWeek,agendaDay'
                            }}
                            defaultDate={this.state.date}
                            navLinks={true} // can click day/week names to navigate views
                            editable={true}
                            eventLimit={true} // allow "more" link when too many events
                            events={this.state.events}
                            // select={this.handleSelection.bind(this)}
                            eventDrop={this.handleDropEvent.bind(this)}
                            // eventClick={this.handleEventClick.bind(this)}
                            selectable={true}
                            selectHelper={true}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Schedule;