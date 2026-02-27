Ext.define('CGP.USExemptionCert.view.QuestionsWin', {
    extend: 'Ext.window.Window',
    modal: true,
    previewWidth: 150,
    previewHeight: 150,
    constrain: true,
    layout: 'fit',
    width: 900,
    minHeight: 200,
    maxHeight: 450,
    autoScroll: true,


    initComponent: function () {
        var me = this;


        /*if (Ext.isEmpty(me.projectId)) {
         throw new Error('project id can not be null!');
         }*/

        me.title = i18n.getKey('问询');
        me.items = [
            {
                xtype: 'grid',
                columns: [
                    {
                        xtype: 'rownumberer'
                    },
                    {
                        text: '问题/回答',
                        flex: 1,
                        dataIndex: 'operateDate',
                        renderer: function (value, metadata, record) {
                            value = Ext.Date.format(new Date(value), 'Y/m/d H:i');
                            metadata.tdAttr = 'data-qtip="' + record.get('question') + '   ' + record.get('answer') + '"';
                            return record.get('question') +'    '+ '<div style="color:green;">' + record.get('answer') + '</div>';
                        }
                    }
                ],
                autoScroll: true,
                store: {
                    xtype: 'store',
                    autoLoad: true,
                    fields: ['question', 'answer'],
                    data: me.questions
                }
            }
        ]
        me.callParent(arguments);

        me.show();

    }
})
