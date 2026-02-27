/**
 * Created by nan on 2020/6/23.
 */
Ext.define("CGP.orderlineitem.view.jobtaskdistribute.Details", {
    extend: "Ext.form.Panel",
    requires : [
        "CGP.orderlineitem.view.jobtaskdistribute.model.JobTaskDistribute",
        "CGP.orderlineitem.view.jobtaskdistribute.view.PageGroup",
        "CGP.orderlineitem.view.jobtaskdistribute.view.Impressions",
        "CGP.orderlineitem.view.jobtaskdistribute.view.Documents"
    ],
    bodyStyle: 'padding:10px',
    bodyPadding: '20 10 20 10',
    autoScroll: true,
    region: 'center',
    defaults: {
        width: '100%'
    },
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 120,
        msgTarget: 'side',
        validateOnChange: false
    },

    initComponent:function(){
        var me=this;
        var urlParams = Ext.Object.fromQueryString(location.search);
        var JobTaskDistributeModel = null;
        if (urlParams.id != null) {
            JobTaskDistributeModel = Ext.ModelManager.getModel("CGP.orderlineitem.view.jobtaskdistribute.model.JobTaskDistribute");
        }
        me.items= [
            {
                name: 'jobBatchIds',
                //allowBlank: false,
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('jobBatchIds'),
                itemId: 'jobBatchIds'
            },
            {
                name: 'singleJobConfigId',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('singleJobConfigId'),
                itemId: 'singleJobConfigId'
            },
            {
                name: 'jobType',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('jobType'),
                itemId: 'jobType'
            },
            {
                name: 'status',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('status'),
                itemId: 'status'
            },
            {
                name: 'pageGroup',
                xtype: 'pagegroup',
                //fieldLabel: i18n.getKey('pageGroup'),
                itemId: 'pageGroup',
                width:'100%'
            },
            {
                name: 'impressions',
                xtype: 'taskimpression',
                flex: 1,
                //fieldLabel: i18n.getKey('impression'),
                itemId: 'impressions'
            },
            {
                name: 'documents',
                xtype: 'taskdoc',
                //fieldLabel: i18n.getKey('documents'),
                itemId: 'documents'
            }
        ];
        me.callParent(arguments);
        if (!Ext.isEmpty(urlParams.id)) {
            JobTaskDistributeModel.load(Number(urlParams.id), {
                success: function (record, operation) {
                    me.refreshData(record.data);
                }
            });
        } else {
            //me.refreshData(data);
        }
    },

    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        me.data = data;
        Ext.Array.each(items, function (item) {
            item.setValue(data[item.name]);
        })
    }
});