document.addEventListener('DOMContentLoaded', () => {
    const countryForm = document.getElementById('country-form');
    const countryList = document.getElementById('country-list');
    const dataToggle = document.getElementById('data-toggle');
    const barGraph = document.getElementById('bar-graph');
    let countries = JSON.parse(localStorage.getItem('countries')) || [];
    let isEditing = false;
    let editingCountryId = null;

    function init() {
        renderCountryList();
        renderBarGraph('population');
    }

    countryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('country-name').value.trim();
        const population = parseInt(document.getElementById('country-population').value);
        const carbonFootprint = parseInt(document.getElementById('country-carbon-footprint').value);

        if (!name || population < 1 || population > 10 || carbonFootprint < 1 || carbonFootprint > 10) {
            alert('Please provide valid inputs.');
            return;
        }

        if (isEditing) {
            updateCountry({ id: editingCountryId, name, population, carbonFootprint });
        } else {
            addCountry({ id: Date.now(), name, population, carbonFootprint });
        }

        countryForm.reset();
        isEditing = false;
        editingCountryId = null;
        renderCountryList();
        renderBarGraph(dataToggle.value);
    });

    function addCountry(country) {
        countries.push(country);
        saveCountries();
    }

    function updateCountry(updatedCountry) {
        countries = countries.map(country => country.id === updatedCountry.id ? updatedCountry : country);
        saveCountries();
    }

    function deleteCountry(id) {
        countries = countries.filter(country => country.id !== id);
        saveCountries();
        renderCountryList();
        renderBarGraph(dataToggle.value);
    }

    function saveCountries() {
        localStorage.setItem('countries', JSON.stringify(countries));
    }

    function renderCountryList() {
        countryList.innerHTML = '';
        countries.forEach(country => {
            const li = document.createElement('li');
            li.textContent = `${country.name} - Population: ${country.population}, Carbon Footprint: ${country.carbonFootprint}`;
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => editCountry(country.id);
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteCountry(country.id);
            li.append(editBtn, deleteBtn);
            countryList.appendChild(li);
        });
    }

    function editCountry(id) {
        const country = countries.find(country => country.id === id);
        document.getElementById('country-id').value = country.id;
        document.getElementById('country-name').value = country.name;
        document.getElementById('country-population').value = country.population;
        document.getElementById('country-carbon-footprint').value = country.carbonFootprint;
        isEditing = true;
        editingCountryId = id;
    }

    function renderBarGraph(dataType) {
        barGraph.innerHTML = '';
        const maxValue = 10;
        countries.forEach(country => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.width = `${(country[dataType] / maxValue) * 100}%`;
            bar.textContent = `${country.name}: ${country[dataType]}`;
            barGraph.appendChild(bar);
        });
    }

    dataToggle.addEventListener('change', (e) => {
        renderBarGraph(e.target.value);
    });

    init();
});
