/**
 * @author xiu
 * @date 2025/9/26
 */
Ext.define('CGP.producebufferdayssetting.model.ProduceBufferDaysSettingModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'string',
            useNull: true
        },
        {
            name: 'qtyTo',
            type: 'number'
        },
        {
            name: 'qtyFrom',
            type: 'number'
        },
        {
            name: 'qtySpace',
            type: 'string',
            convert: function (value, record) {
                var qtyTo = record.get('qtyTo'),
                    qtyFrom = record.get('qtyFrom'),
                    result = `${qtyFrom} - ${qtyTo}`

                if (!qtyTo) {
                    result = `${qtyFrom} - ${JSCreateFont('green', true, '+∞',15)}`
                }

                if (qtyFrom === qtyTo){
                    result = `${qtyFrom}`
                }
                
                return result;
            },
        },
        {
            name: 'minDay',
            type: 'number',
        },
        {
            name: 'maxDay',
            type: 'number',
        },
        {
            name: 'daySpace',
            type: 'string',
            convert: function (value, record) {
                var minDay = record.get('minDay'),
                    maxDay = record.get('maxDay'),
                    result = `${minDay} - ${maxDay}`

                if (!maxDay) {
                    result = `${minDay}`
                }

                if (minDay === maxDay){
                    result = `${minDay}`
                }
                
                return result;
            },
        },
    ],
})