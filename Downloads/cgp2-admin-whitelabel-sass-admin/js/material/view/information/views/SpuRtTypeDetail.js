Ext.define('CGP.material.view.information.baseinfo.RtTypeDetail', {

    extend: 'Ext.form.Panel',
    alias: 'widget.spurttypedetail',

    defaultType: 'textfield',
    bodyStyle: 'border-color:silver;padding: 10px',
    header: {
        style: 'background-color:white;',
        color: 'black',
        border: '0 0 0 0'
    },
    initComponent: function () {
        var me = this;

        me.title = '<font color=green>' + i18n.getKey('spuRtType') + '</font>';

        me.callParent(arguments);

    },
    setValue: function (info) {

        var me = this;

        me.removeAll();

        var spuRtType = info.spuRtType;


        Ext.Object.each(spuRtType, function (key, value) {

            me.add(Ext.widget({
                xtype: 'textfield',
                fieldLabel: key,
                value: value
            }));

        })

    }

});