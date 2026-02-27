/**
 * Created by shirley on 2021/07/15
 */
Ext.define('CGP.pcspreprocesscommonsource.view.SvgFileSourceFrom', {
    extend: 'CGP.pcspreprocesscommonsource.view.SubEditForm',
    designId: '',
    isValidForItems:true,
    defaults: {
        padding: '10 25 5 25',
        width: 375,
        labelAlign: 'left',
        labelWidth: 120
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                name: 'clazz',
                xtype: 'textfield',
                hidden: true,
                allowBlank: false,
                itemId: 'clazz',
                value:'com.qpp.cgp.domain.pcspreprocess.source.SvgFileSourceConfig'
            },
            {
                name: 'pathValueEx',
                itemId: 'pathValueEx',
                xtype: 'valueexfield',
                width:397,
                fieldLabel: i18n.getKey('pathValueEx'),
                commonPartFieldConfig: {
                    defaultValueConfig: {
                        type: 'String',
                        clazz: 'com.qpp.cgp.value.ConstantValue',
                        typeSetReadOnly: true,
                        clazzSetReadOnly: false
                    }
                }
            }
        ];
        me.callParent();
    }
})