chrome.action.onClicked.addListener((tab) => {
    if (!tab.url.includes('chrome://')) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (tabUrl) => {
                function formatUrl(url) {
                    if (!url.includes('.en-gb.html')) {
                        url = url.replace('.html', '.en-gb.html');
                    }
                    return url.split('?')[0]; // Удаляем query параметры
                }

                function fetchData(url) {
                    // Формируем отформатированный URL
                    const formattedUrl = formatUrl(url);

                    // Отправляем POST запрос на сервер
                    fetch('https://estatemarket.io/api/for_extension', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url: formattedUrl }),
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Response:', data);

                        // Находим все элементы на странице с классом hprt-roomtype-icon-link
                        const roomElements = document.querySelectorAll('.hprt-roomtype-icon-link');

                        // Проходимся по каждому элементу и сопоставляем с данными из API
                        roomElements.forEach(element => {
                            const roomName = element.textContent.trim();

                            // Находим соответствующую запись в данных API
                            const roomData = data.find(item => item.room_type === roomName);

                            // Если данные найдены, добавляем occupancy рядом с названием комнаты
                            if (roomData) {
                                const occupancy = roomData.occupancy;
                                element.textContent += ` (Occupancy: ${occupancy}%)`;
                            }
                        });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }

                // Вызываем функцию для получения данных и обработки элементов на странице
                fetchData(tabUrl);
            },
            args: [tab.url]
        });
    }
});
