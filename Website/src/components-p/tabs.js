import React from 'react';
import { TabContent, TabPane } from 'reactstrap';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const TabsNav = (props) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div>
            <TabContent activeTab={value}>
                {
                    props.tabs.map((elements, index) => {
                        return (
                            <TabPane key={index+Math.random} tabId={index}>
                                {elements}
                            </TabPane>
                        )
                    }
                    )
                }
            </TabContent>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                aria-label="icon label tabs example"
                className="footer"
                style={{background:"white"}}
            >
                {
                    props.tabsName.map((elements, index) => {
                        let temp = props.tabsIcon[index]
                        return (<Tab key={index+Math.random} icon={temp} label={elements} />)

                    })
                }
            </Tabs>
        </div>
    );
}

export default TabsNav;