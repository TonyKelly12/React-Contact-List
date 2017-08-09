import React from 'react';
import image from '../images/cloud-upload-download-data-transfer.svg';
import Collapsible from './Collapsible';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            contacts: []
        }
    }

    componentWillMount() {
        //this line checks to see if contacts is in local storage if so....
        localStorage.getItem('contacts') && this.setState({
            //this line parses the json thats in local storage and sets it to contacts
            contacts:JSON.parse(localStorage.getItem('contacts')),
            //sets this is loading animation to false
            isLoading: false
        })
    }

    componentDidMount() {
        //checks if contactsDate is in local storager
        const date = localStorage.getItem("contactsDate");
        //Will get current time from loacal storage and place in contactsDate
        const contactsDate = date && new Date(parseInt(date));
        //creates a time stamp of right now
        const now = new Date();
        // takes the date of ow and subtracts from local storage date to come up with 
        // age then converts to minutes (1000 * 60) and sets to dataAge
        const dataAge = Math.round((now - contactsDate) / (1000 * 60));
        //IF dataAge is grater than 10min tooOLd will return true
        const tooOld = dataAge >= 10;
        
        //AS componentWillMount runs first, must run if statement to see if...
        //contacts exist and if greater than 15 min in local storage
        if (tooOld){
          this.fetchData();  
        }else{
            console.log("using data from local storage that is " + dataAge + " minutes old")
        }
        
    }

    fetchData() {
        this.setState({
            isLoading: true,
            contacts: []
        })
        //sends the call to the api    
        fetch('https://randomuser.me/api/?results=50&nat=us,dk,fr,gb')
        //returns response in json
        .then(response => response.json())
        //parses the json in this case json returns objects as users
        // this line maps out the properties of each user object and returns data needed
        .then(parsedJSON => parsedJSON.results.map(user =>(
            {
                name: `${user.name.first} ${user.name.last}`,
                username: `${user.login.username}`,
                email: `${user.email}`,
                location: `${user.location.street}, ${user.location.city}`
            }
        )))
        //this line of code sets the group of users as a contacts object 
        .then(contacts => this.setState({
            contacts,
            isLoading: false
        }))
        //if a error is thrown it will catch the error and log it
        .catch(error => console.log('parsing failed', error))
    }

componentWillUpdate(nextProps, nextState)  {
    //takes the contacts list and stores in local sstorage
    localStorage.setItem('contacts', JSON.stringify(nextState.contacts));
    //adds the Time and date item to the local storage used to calculate how old the data is
    localStorage.setItem("contactsDate", Date.now());
}


    render() {
        //the below const makes it to where i can use contact and isLoading
        const {isLoading, contacts} = this.state;
        return (
            <div>
                <header>
                    <img src={image}/>
                    <h1>Fetching Data
                        <button className="btn btn-sm btn-danger" onClick={(e) =>{
                            this.fetchData();
                        }}>Fetch now</button>
                    </h1>
                </header>
                <div className={`content ${isLoading ? 'is-loading' : ''}`}>
                    <div className="panel-group">
                    {
                        !isLoading && contacts.length > 0 ? contacts.map(contact => {
                            //the below const makes it to where i dont have to use contact.username etc...
                            //I can just use {username}
                            const {username, name, email, location} = contact;
                            return <Collapsible key={username} title={name}>
                            <p>{email}<br/>{location}</p>
                        </Collapsible>
                        }) : null
                        
                    }   
                    </div>
                    <div className="loader">
                    <div className="icon">
                    </div>
                    </div>
                </div>
                
            </div>
        );
    }
}
export default App;
