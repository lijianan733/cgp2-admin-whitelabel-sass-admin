/**
 * Created by nan on 2021/8/24
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.view.IndexMappingFieldContainer', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.indexmappingfieldcontainer',
    defaults: {
        width: '100%',
        margin: '5 0 5 25',
    },
    title: i18n.getKey('mappingRule'),
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'combo',
                name: 'clazz',
                itemId: 'clazz',
                fieldLabel: i18n.getKey('type'),
                editable: false,
                valueField: 'value',
                displayField: 'display',
                value: 'com.qpp.cgp.domain.theme.SequenceRepeatConfig',
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.theme.SequenceRepeatConfig',
                            display: i18n.getKey('顺序应用')
                        }, {
                            value: 'com.qpp.cgp.domain.theme.RandomIndexMappingConfig',
                            display: i18n.getKey('随机应用')
                        },
                        {
                            value: 'com.qpp.cgp.domain.theme.ExpressionIndexMappingConfig',
                            display: i18n.getKey('自定义规则应用')
                        }
                    ]
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var expression = combo.ownerCt.getComponent('expression');
                        expression.setVisible(newValue == 'com.qpp.cgp.domain.theme.ExpressionIndexMappingConfig');
                        expression.setDisabled(!(newValue == 'com.qpp.cgp.domain.theme.ExpressionIndexMappingConfig'));
                    }
                }
            }, {
                xtype: 'expressionfield',
                allowBlank: false,
                name: 'expression',
                hidden: true,
                disabled: true,
                itemId: 'expression',
                fieldLabel: i18n.getKey('expression')
            }
        ];
        me.callParent();
    }
})