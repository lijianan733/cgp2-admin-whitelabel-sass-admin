/**
 * @Description: 简单的boolean数据combo
 * @author nan
 * @date 2022/5/20
 */
Ext.define('CGP.common.field.BooleanCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.booleancombo',
    editable: false,
    displayField: 'display',
    valueField: 'value',
    store: {
        xtype: 'store',
        fields: [{
            name: 'value',
            type: 'boolean'
        }, {
            name: 'display',
            type: 'string'
        }],
        data: [
            {
                value: true,
                display: i18n.getKey('true')
            },
            {
                value: false,
                display: i18n.getKey('false')
            }
        ],
    },
})
