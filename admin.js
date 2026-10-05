const searchAppointments =
    document.querySelector("#searchAppointments");
const appointmentCount =
    document.querySelector("#appointmentCount");

const refreshAppointments =
    document.querySelector("#refreshAppointments");const appointmentsContainer =
    document.querySelector("#appointmentsContainer");


async function loadAppointments() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/appointments"
        );

        const appointments = await response.json();
        appointmentCount.textContent = appointments.length;
        document.querySelector("#totalCount").textContent =
    appointments.length;

document.querySelector("#pendingCount").textContent =
    appointments.filter(a => a.status === "Pending").length;

document.querySelector("#confirmedCount").textContent =
    appointments.filter(a => a.status === "Confirmed").length;


        if (appointments.length === 0) {

            appointmentsContainer.innerHTML =
                "<p>No appointments found.</p>";

            return;
        }


        appointmentsContainer.innerHTML = "";


        appointments.forEach((appointment) => {

            const appointmentCard =
                document.createElement("div");

            appointmentCard.className =
                "appointment-card";
                appointmentCard.innerHTML = `
    <h3>${appointment.name}</h3>

    <p>
        <strong>Phone:</strong>
        ${appointment.phone}
    </p>

    <p>
        <strong>Service:</strong>
        ${appointment.service}
    </p>

    <p>
        <strong>Date:</strong>
        ${appointment.date}
    </p>

    <p>
        <strong>Time:</strong>
        ${appointment.time}
    </p>

    <p>
        <strong>Status:</strong>
        <span class="appointment-status ${appointment.status.toLowerCase()}">
            ${appointment.status}
        </span>
    </p>

    <div class="appointment-buttons">

        <button
            class="confirm-btn"
            onclick="updateStatus('${appointment._id}', 'Confirmed')">
            Confirm
        </button>

        <button
            class="cancel-btn"
            onclick="updateStatus('${appointment._id}', 'Cancelled')">
            Cancel
        </button>

    </div>
`;       
            

            appointmentsContainer.appendChild(
                appointmentCard
            );

        });


    } catch (error) {

        console.error(error);

        appointmentsContainer.innerHTML =
            "<p>Unable to load appointments.</p>";
    }
}


loadAppointments();
refreshAppointments.addEventListener(
    "click",
    loadAppointments
);
async function updateStatus(id, status) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/appointments/${id}/status`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert(data.message);
        searchAppointments.addEventListener("input", () => {

    const searchText =
        searchAppointments.value.toLowerCase();

    document
        .querySelectorAll(".appointment-card")
        .forEach(card => {

            const customerName =
                card.querySelector("h3").textContent.toLowerCase();

            card.style.display =
                customerName.includes(searchText)
                    ? "block"
                    : "none";
        });
});

            loadAppointments();

        } else {

            alert(data.message || "Failed to update status.");
        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");
    }
}