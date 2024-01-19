import React, { useRef, useState, Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';

let BILLDETAILS = [];
class DBPedia extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            result: '',
            trigger: false,
        };

        this.triggetNext = this.triggetNext.bind(this);
    }

    componentDidMount() {
        this.triggetNext()
    }

    UNSAFE_componentWillMount() {
        const self = this;
        const { steps } = this.props;
        const regNo = steps.getRegNo.value;
        console.log(regNo);
        const queryUrl = `http://localhost:5000/fetchDataWater`;

        const xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', readyStateChange);

        function readyStateChange() {
            if (this.readyState === 4) {
                // console.log(this.responseText);
                // BILLDETAILS = typeof(this.responseTextdata);
                // console.log("Consumer Name : " + BILLDETAILS)
                // const data = JSON.parse(this.responseText);
                // console.log("Data: " + data)

                const bindings = JSON.parse(this.responseText);
                console.log(bindings.Result.ResponseVal);
                if (bindings.Result.ResponseVal === 1) {
                    BILLDETAILS = [
                        "Consumer Name: " + bindings.Result.ResponseData.ConsumerName,
                        "Bill Number : " + bindings.Result.ResponseData.BillNumber,
                        "Bill Date : " + bindings.Result.ResponseData.BillDate,
                        "Bill Amount : " + bindings.Result.ResponseData.BillAmount
                    ]
                    self.setState({ loading: false, result: BILLDETAILS });
                } else {
                    BILLDETAILS = [
                        "Error: Not found."
                    ]
                    self.setState({ loading: false, result: BILLDETAILS });
                }


            }
        }
        const data = {
            RRNo: 'SE203181',
            SubDivisionID: '',
            DuplicateCheckRequired: 'N',
            CityCode: 'BN',
            ServiceCityId: '97',
            CityId: 2
        };
        xhr.open('POST', queryUrl);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data));
    }

    triggetNext() {
        this.setState({ trigger: true }, () => {
            this.props.triggerNextStep();
        });
    }

    render() {
        const { trigger, loading } = this.state;

        return (
            <div className="dbpedia">
                {loading ? <Loading /> : <div>
                    <p>Bill details:</p>
                    {BILLDETAILS.map((detail, index) => (
                        <p key={index}>{detail}</p>
                    ))}
                </div>}
                {
                    !loading &&
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: 20,
                        }}
                    >
                        {
                            !trigger &&
                            <button>
                                Continue
                            </button>
                        }
                    </div>
                }
            </div>
        );

    }
}

DBPedia.propTypes = {
    steps: PropTypes.object,
    triggerNextStep: PropTypes.func,
};

DBPedia.defaultProps = {
    steps: undefined,
    triggerNextStep: undefined,
};

function Normal() {
    const [, setFetchedData] = useState(null);
    const myref = useRef(null);
    const fetchData = async (regNo) => {
        try {
            const data = {
                RRNo: regNo,
                SubDivisionID: '',
                DuplicateCheckRequired: 'N',
                CityCode: 'BN',
                ServiceCityId: '97',
                CityId: "2",
            };

            const response = await axios.post('http://localhost:5000/fetchDataWater', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {

                BILLDETAILS = [
                    "Consumer Name: " + response.data.Result.ResponseData.ConsumerName,
                    "Bill Number : " + response.data.Result.ResponseData.BillNumber,
                    "Bill Date : " + response.data.Result.ResponseData.BillDate,
                    "Bill Amount : " + response.data.Result.ResponseData.BillAmount
                ]
                setFetchedData(response.data);
                console.log(BILLDETAILS)
            } else {
                console.error("Error fetching data")
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleEnd = async ({ steps, values }) => {
        await fetchData(values[0]);
    };

    // const DisplayDataComponent = () => {
    //     console.log(BILLDETAILS)
    //     if (BILLDETAILS[0]) {
    //         return (
    //             <div>
    //                 <div>
    //                     <p>Bill details:</p>
    //                     {BILLDETAILS.map((detail, index) => (
    //                         <p key={index}>{detail}</p>
    //                     ))}
    //                 </div>
    //             </div>
    //         );
    //     }
    //     else {
    //         console.log(BILLDETAILS[0]);
    //         <div>
    //             <div>
    //                 <p>No bill avaiable for this consumer ID</p>
    //             </div>
    //         </div>
    //     }
    // };

    return (
        <ChatBot ref={myref}
            width="1000px"
            height="650px"
            steps={[
                {
                    id: '1',
                    message: 'Welcome to the M1/K1 bill payment bot. Which bill do you want to pay?',
                    trigger: 'options',
                },
                {
                    id: 'options',
                    options: [
                        { label: 'Electricity Bill', trigger: 'consumerID' },
                        { label: 'Water Bill', trigger: 'consumerID' },
                        { label: 'Traffic Fine', trigger: 'consumerID' },
                        { label: 'Extract RC', trigger: 'consumerID' },
                    ],
                },
                {
                    id: "consumerID",
                    message: "Please enter your consumer ID",
                    trigger: "getRegNo"
                },
                {
                    id: 'getRegNo',
                    user: true,
                    trigger: 'fetchData',
                },
                {
                    id: 'fetchData',
                    message: 'Fetching bill details .....',
                    trigger: 'displayData',
                },
                {
                    id: 'displayData',
                    asMessage: true,
                    // component: <DisplayDataComponent />,
                    component: <DBPedia />,
                    waitAction: true,
                    trigger: 'PayOrNot'
                },
                {
                    id: "PayOrNot",
                    message: "Do you want to pay the biil",
                    trigger: "yesNO"
                },
                {
                    id: "yesNO",
                    options: [
                        { value: "Yes", label: 'YES' },
                        { value: "No", label: 'NO' },
                    ],
                }
            ]}
            handleEnd={handleEnd}
        />
    );
}

export default Normal
