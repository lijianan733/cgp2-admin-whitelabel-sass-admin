/**
 * @author xiu
 * @date 2025/2/25
 */
Ext.define('CGP.profitmanagement.view.CreateSquareInfoComp', {
    extend: 'Ext.container.Container',
    alias: 'widget.create_square_info_comp',
    width: 500,
    layout: {
        type: 'table',
        columns: 4
    },
    defaults: {
        margin: '0 12 0 0',
    },
    diySetValue: function (data) {
        var me = this,
            controller = Ext.create('CGP.profitmanagement.controller.Controller');

        if (data) {
            var me = this,
                {currency} = data,
                {year, month} = controller.getLastNowYearMonth(data['year'], data['month'], 0),
                {code, symbol, symbolLeft} = currency,
                items = me.items.items;

            data['settleDate'] = `${year} - ${month}`;
            
            console.log(data);
            items.forEach(item => {
                var {name} = item,
                    result = data[name];

                // 加货币符号
                if (['amount', 'transferBalance', 'waitTransferBalance', 'outTransferBalance', 'inTransferBalance'].includes(name)) {
                    result = `${symbolLeft} ${result}`
                }
                
                item.diySetValue ? item.diySetValue(result) : item.setValue(result);
            })
        }
    },
    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('Partner ID'),
                itemId: 'partnerId',
                name: 'partnerId',
                colspan: 4,
                labelWidth: 70,
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('Partner Email'),
                itemId: 'partnerEmail',
                name: 'partnerEmail',
                colspan: 4,
                labelWidth: 100,
            },
            {
                xtype: 'displayfield',
                itemId: 'settleDate',
                name: 'settleDate',
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('总盈余'),
                itemId: 'amount',
                name: 'amount',
                labelWidth: 45,
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('未结清盈余'),
                itemId: 'waitTransferBalance',
                name: 'waitTransferBalance',
                labelWidth: 70,
            },
        ];
        me.callParent();
    }
})