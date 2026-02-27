/**
 * Created by nan on 2019/3/29.
 * 数学运算符store
 */
Ext.define('CGP.common.valueExV2.store.OperatorStore', {
        extend: 'Ext.data.Store',
        fields: [
            {
                name: 'display',
                type: 'string'
            },
            {
                name: 'value',
                type: 'string'
            }
        ],
        data: [
            {
                display: '==',
                value: '=='
            },
            {
                display: '<',
                value: '<'
            },
            {
                display: '<=',
                value: '<='
            },
            {
                display: '>',
                value: '>'
            }, {
                display: '>=',
                value: '>='
            }, {
                display: '!=',
                value: '!='
            }
        ]
    }
)
