/*import { Table, Button, Badge } from 'react-bootstrap';

const MaintenanceTracker = ({ carId }) => {
    const [maintenanceItems, setMaintenanceItems] = useState([
        { type: 'Oil Change', dueKm: 150000, dueDate: '2023-10-15', completed: false },
        // Other items...
    ]);

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Due KM</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {maintenanceItems.map((item, index) => (
                        <tr key={index}>
                            <td>{item.type}</td>
                            <td>{item.dueKm}</td>
                            <td>{item.dueDate}</td>
                            <td>
                                <Badge bg={item.completed ? "success" : "warning"}>
                                    {item.completed ? "Completed" : "Pending"}
                                </Badge>
                            </td>
                            <td>
                                <Button size="sm">Mark Complete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button variant="primary">Add New Reminder</Button>
        </div>
    );
};*/