/**
 * Created by admin on 2020/8/13.
 */
Ext.define('CGP.orderlineitem.view.jobtaskdistribute.view.Impressions', {
    extend: 'Ext.form.Panel',
    alias: 'widget.taskimpression',
    requires:['Ext.ux.form.GridField','CGP.orderlineitem.view.jobtaskdistribute.view.ImpressionSheets'],
    defaultType: 'displayfield',
    bodyStyle: 'border-color:white;',
    header: false,
    width: '100%',
    padding:10,
    layout: {
        type: 'table',
        columns: 2
    },
    defaults: {
        labelAlign: 'left',
        width: 922
    },
    data:null,

    initComponent: function () {
        var me = this;
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                //style: 'background-color:silver;',
                color: 'black',
                bodyStyle: 'border-color:white;',
                border: '1 0 0 0',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('Impression') + '</font>'
                    }
                ]

            }
        ];

        me.callParent(arguments);
    },
    addNewConfig: function (data) {
        var me = this;
        var impressionSheet = me.insert(me.items.items.length, {
            xtype:'displayfield',
            width:109
        });
        var impressionSheet = me.insert(me.items.items.length, {
            xtype: 'impressionsheet',
            minHeight: 150,
            data: data,//渲染后赋值
            title: Ext.isEmpty(data) ?'':data._id+"("+i18n.getKey('impressionConfig')+"Id:"+data["templateId"]+")",
            collapsed: true,//初始时收缩状态
            collapsible: true
        });
        return impressionSheet;
    },
    setValue:function(data){
        var me = this;
        for (var i = 0; i < data.length; i++) {
            var impressionData = data[i];
            var sheetFieldSet = me.addNewConfig(impressionData);
            if (i == 0) {
                sheetFieldSet.expand();
            }
        }
    }
})