import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Col, Row } from "reactstrap"

class DoughnutChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {

    return (
      <Row>
        <Col>
          <div className="center" style={{ marginTop:"-20px", width: "78%" }}>
            <Doughnut
              options={{
                responsive: true,
                maintainAspectRatio: true,
                animation: {
                  duration: 0
              },
              plugins: {
                legend: {
                  position:"right",
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 16,
                            weight:"bold",
                            family:'Verdana'
                        }
                    }
                }
            }
              }}
              data={this.props.data} />
                <div style={{fontSize:"0.8rem"}}>
                OwO: Financial Inclusion for young people
                  </div>
          </div>
        </Col>
      </Row>
    )
  }
}

export default DoughnutChart;