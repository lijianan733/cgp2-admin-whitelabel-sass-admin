Ext.onReady(function() {
    Ext.create('Ext.form.Panel', {
        renderTo: Ext.getBody(),
        width: 500,
        height: 500,
        bodyPadding: 10,
        title: 'Final Score',
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Home',
            name: 'home_score',
            fieldStyle:'color:red;',
            value: 10
        }, {
            xtype: 'textfield',
            fieldLabel: 'Visitor',
            name: 'visitor_score',
            value: '11'
        },{
            xtype: 'fieldset',
            fieldLabel: 'test',
            title: '联系信息',
            collapsible: true,
            items: [
                {
                    xtype: 'fieldset',
                    fieldLabel: 'test',
                    title: '联系信息',
                    collapsible: true,
                    items: [
                        {
                            xtype: 'fieldset',
                            fieldLabel: 'test',
                            title: '联系信息',
                            collapsible: true,
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'test2',
                                    name: 'visitor_score',
                                    value: '11'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'test3',
                                    name: 'visitor_score',
                                    value: '11'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            fieldLabel: 'test',
                            title: '联系信息',
                            collapsible: true,
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'test2',
                                    name: 'visitor_score',
                                    value: '11'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'test3',
                                    name: 'visitor_score',
                                    value: '11'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'test3',
                    name: 'visitor_score',
                    value: '11'
                }
            ]
        }],
        buttons: [{
            text: 'Update',
            handler: function(button){
                console.log(button.ownerCt.ownerCt.items.items);

            }
        }]
    });

});