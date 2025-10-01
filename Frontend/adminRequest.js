document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/requests')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('requestTableBody');

            if (data.error) {
                tableBody.innerHTML = `<tr><td colspan="6">${data.error}</td></tr>`;
                return;
            }

            data.forEach(request => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${request.type}</td>
                    <td>${request.studentName}</td>
                    <td>${request.rollNo}</td>
                    <td>${request.book_name}</td>
                    <td>${request.req_date}</td>
                    <td>
                        <button class="approve-btn" data-id="${request.requestID}">Approve</button>
                        <button class="reject-btn" data-id="${request.requestID}">Reject</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });

            // Add event listeners to Approve and Reject buttons
            document.querySelectorAll('.approve-btn').forEach(button => {
                button.addEventListener('click', () => handleRequest(button.dataset.id, 'approved'));
            });

            document.querySelectorAll('.reject-btn').forEach(button => {
                button.addEventListener('click', () => handleRequest(button.dataset.id, 'rejected'));
            });
        })
        .catch(error => {
            console.error('Error fetching requests:', error);
            const tableBody = document.getElementById('requestTableBody');
            tableBody.innerHTML = `<tr><td colspan="6">Failed to load requests.</td></tr>`;
        });

    function handleRequest(requestID, action) {
        fetch(`http://localhost:3000/api/requests/${requestID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Request ${action} successfully.`);
                location.reload();
            } else {
                alert(`Failed to ${action} the request: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error processing request:', error);
            alert('An error occurred while processing the request.');
        });
    }
});
