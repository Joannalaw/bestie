import React, {useEffect, useState} from 'react';

function App() {
    const [data, setData] = useState([{}]);
    useEffect(() => {
        fetch('/api').then(response => response.json()).then(data => {
            setData(data)
        })
    }, []);

    return (
        <div>
            {(typeof data.users === 'undefined') ? (
                    <p>Loading...</p>
                ) :
                (data.users.map(user => (<p key={user}>{user}</p>)))}
            </div>
    );
}

export default App;