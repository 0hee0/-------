import React, { useState } from 'react'
import { Collapse, Checkbox } from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {
    const [checked, setChecked] = useState([])

    const handleToggle = (value) => {
        // 누른 것의 Index를 구하고
        const currentIndex = checked.indexOf(value)

        // 전체 checked된 state에서 현재 누른 Checkbox가
        const newChecked = [...checked]

        if (currentIndex === -1) {
            // 없다면 state에 넣어준다.
            newChecked.push(value)
        } else {
            //  이미 있다면 state에서 빼준다.
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
        props.handleFilters(newChecked)
    }

    const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox onChange={() => handleToggle(value._id)} 
                checked={checked.indexOf(value._id) === -1 ? false : true} />
            <span>{value.name}</span>
        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="Continents" key="1">
                    {renderCheckboxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
