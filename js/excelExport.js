// Excel Export System
const ExcelExport = {
    // Экспорт данных по клиенту
    async exportClientData(clientId, format = 'xlsx') {
        if (!AuthManager.hasPermission('export_data')) {
            Utils.showNotification('Недостаточно прав для экспорта', 'error');
            return;
        }

        const client = State.getClients().find(c => c.id === clientId);
        if (!client) {
            Utils.showNotification('Клиент не найден', 'error');
            return;
        }

        // Собираем данные для экспорта
        const exportData = await this.prepareExportData(clientId);

        // Экспортируем в зависимости от формата
        if (format === 'xlsx') {
            await this.exportToExcel(client, exportData);
        } else if (format === 'csv') {
            await this.exportToCSV(client, exportData);
        }
    },

    // Подготовка данных для экспорта
    async prepareExportData(clientId) {
        const client = State.getClients().find(c => c.id === clientId);
        const surveys = State.getSurveys().filter(s => s.clientId === clientId);
        const feedback = State.getFeedback().filter(f => f.clientId === clientId);

        // Группируем ответы по ролям
        const byRole = {
            lpr: [],
            tech_deploy: [],
            tech_support: [],
            business: []
        };

        feedback.forEach(item => {
            const role = this.getUserRole(item.userId);
            if (byRole[role]) {
                byRole[role].push(item);
            }
        });

        // Расчет метрик
        const metrics = this.calculateMetrics(feedback);

        return {
            client,
            surveys,
            feedback,
            byRole,
            metrics,
            exportDate: new Date().toISOString()
        };
    },

    // Расчет метрик
    calculateMetrics(feedback) {
        const npsScores = feedback.filter(f => f.nps !== undefined).map(f => f.nps);
        const csatScores = feedback.filter(f => f.csat !== undefined).map(f => f.csat);
        const cesScores = feedback.filter(f => f.ces !== undefined).map(f => f.ces);

        // NPS
        const promoters = npsScores.filter(s => s >= 9).length;
        const passives = npsScores.filter(s => s >= 7 && s < 9).length;
        const detractors = npsScores.filter(s => s < 7).length;
        const nps = Utils.calculateNPS(promoters, passives, detractors);

        // CSAT
        const csat = csatScores.length > 0
            ? (csatScores.reduce((a, b) => a + b, 0) / csatScores.length).toFixed(2)
            : 0;

        // CES
        const ces = cesScores.length > 0
            ? (cesScores.reduce((a, b) => a + b, 0) / cesScores.length).toFixed(2)
            : 0;

        return {
            nps,
            csat,
            ces,
            totalResponses: feedback.length,
            promoters,
            passives,
            detractors
        };
    },

    getUserRole(userId) {
        // TODO: получать из базы данных
        // Пока возвращаем случайную роль для демо
        const roles = ['lpr', 'tech_deploy', 'tech_support', 'business'];
        return roles[Math.floor(Math.random() * roles.length)];
    },

    // Экспорт в Excel (используя SheetJS)
    async exportToExcel(client, data) {
        // Проверяем наличие библиотеки XLSX
        if (typeof XLSX === 'undefined') {
            // Загружаем библиотеку динамически
            await this.loadXLSXLibrary();
        }

        // Создаем workbook
        const wb = XLSX.utils.book_new();

        // Добавляем листы для каждой роли
        this.addSummarySheet(wb, client, data);
        this.addRoleSheet(wb, 'ЛПР', data.byRole.lpr);
        this.addRoleSheet(wb, 'Техспец внедрения', data.byRole.tech_deploy);
        this.addRoleSheet(wb, 'Техспец сопровождения', data.byRole.tech_support);
        this.addRoleSheet(wb, 'Бизнес-юзеры', data.byRole.business);
        this.addDetailedSheet(wb, data.feedback);

        // Экспортируем файл
        const fileName = `${this.sanitizeFileName(client.company)}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);

        Utils.showNotification('Excel файл успешно экспортирован!');
    },

    // Загрузка библиотеки XLSX
    async loadXLSXLibrary() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    // Добавление сводного листа
    addSummarySheet(wb, client, data) {
        const summaryData = [
            ['FlowBack - Отчет по клиенту'],
            [],
            ['Клиент:', client.company],
            ['Контакт:', client.contact],
            ['Email:', client.email],
            ['Дата выгрузки:', new Date().toLocaleDateString('ru-RU')],
            [],
            ['МЕТРИКИ'],
            ['NPS:', data.metrics.nps],
            ['CSAT:', data.metrics.csat],
            ['CES:', data.metrics.ces],
            ['Количество ответов:', data.metrics.totalResponses],
            [],
            ['РАСПРЕДЕЛЕНИЕ NPS'],
            ['Промоутеры (9-10):', data.metrics.promoters],
            ['Пассивные (7-8):', data.metrics.passives],
            ['Критики (0-6):', data.metrics.detractors]
        ];

        const ws = XLSX.utils.aoa_to_sheet(summaryData);

        // Устанавливаем ширину колонок
        ws['!cols'] = [
            { wch: 30 },
            { wch: 20 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Общее');
    },

    // Добавление листа по роли
    addRoleSheet(wb, roleName, feedbackItems) {
        if (feedbackItems.length === 0) {
            // Пустой лист
            const ws = XLSX.utils.aoa_to_sheet([
                ['Нет данных для этой роли']
            ]);
            XLSX.utils.book_append_sheet(wb, ws, roleName);
            return;
        }

        const sheetData = [
            ['ID', 'Пользователь', 'Дата', 'NPS', 'CSAT', 'CES', 'Комментарий']
        ];

        feedbackItems.forEach(item => {
            sheetData.push([
                item.id,
                item.contact || 'Аноним',
                new Date(item.date).toLocaleDateString('ru-RU'),
                item.nps || '-',
                item.csat || '-',
                item.ces || '-',
                item.comment || ''
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(sheetData);

        // Устанавливаем ширину колонок
        ws['!cols'] = [
            { wch: 10 },
            { wch: 20 },
            { wch: 15 },
            { wch: 8 },
            { wch: 8 },
            { wch: 8 },
            { wch: 50 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, roleName);
    },

    // Добавление детального листа
    addDetailedSheet(wb, feedback) {
        const sheetData = [
            ['ID', 'Клиент', 'Контакт', 'Дата', 'NPS', 'CSAT', 'CES', 'Тональность', 'Комментарий', 'Теги']
        ];

        feedback.forEach(item => {
            sheetData.push([
                item.id,
                item.client,
                item.contact,
                new Date(item.date).toLocaleDateString('ru-RU'),
                item.nps || '-',
                item.csat || '-',
                item.ces || '-',
                item.sentiment || '-',
                item.comment || '',
                (item.tags || []).join(', ')
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(sheetData);

        ws['!cols'] = [
            { wch: 10 },
            { wch: 25 },
            { wch: 20 },
            { wch: 15 },
            { wch: 8 },
            { wch: 8 },
            { wch: 8 },
            { wch: 12 },
            { wch: 50 },
            { wch: 30 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Детальный отчет');
    },

    // Экспорт в CSV
    async exportToCSV(client, data) {
        const csvData = [
            ['ID', 'Клиент', 'Контакт', 'Дата', 'NPS', 'CSAT', 'CES', 'Комментарий']
        ];

        data.feedback.forEach(item => {
            csvData.push([
                item.id,
                item.client,
                item.contact,
                new Date(item.date).toLocaleDateString('ru-RU'),
                item.nps || '',
                item.csat || '',
                item.ces || '',
                item.comment || ''
            ]);
        });

        const csv = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${this.sanitizeFileName(client.company)}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        Utils.showNotification('CSV файл успешно экспортирован!');
    },

    // Очистка имени файла
    sanitizeFileName(name) {
        return name
            .replace(/[^a-zA-Zа-яА-Я0-9_\-]/g, '_')
            .replace(/__+/g, '_')
            .substring(0, 50);
    },

    // Экспорт всех клиентов (для админа)
    async exportAllClients() {
        if (!AuthManager.isAdmin()) {
            Utils.showNotification('Только для администраторов', 'error');
            return;
        }

        const clients = State.getClients();

        for (const client of clients) {
            await this.exportClientData(client.id, 'xlsx');
            // Задержка между экспортами
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        Utils.showNotification(`Экспортировано ${clients.length} файлов!`);
    }
};