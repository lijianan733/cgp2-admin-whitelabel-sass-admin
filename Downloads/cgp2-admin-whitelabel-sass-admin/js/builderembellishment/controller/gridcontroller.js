Ext.ns('Qpp.CGP.BuilerBackground.Controller');

/**
 *上传新的素材图
 *使用弹窗上传
 */
Qpp.CGP.BuilerBackground.Controller.uploadStuff = function (productFilter, gridStore) {

    var controller = Qpp.CGP.BuilerBackground.Controller;

    //创建上传form
    var uploadForm = new Ext.form.Panel({
        id: 'uploadform',
        frame: false,
        name: 'Upload new BuilderBackground',
        region: 'center',
        formBind: true,
        layout: {
            type: 'table',
            columns: 1
        },
        items: [{
            itemId: 'backgroundClassSelect',
            allowBlank: false,
            name: 'bbgClasses',
            width: 400,
            xtype: 'gridfieldselect',
            fieldLabel: i18n.getKey('imageCategory'),
            labelAlign: 'right',
            gridConfig: {
                height: 200,
                width: 470,
                store: Ext.data.StoreManager.lookup('builderBackgroundClassStore'),
                multiSelect: true,
                selModel: {
                    selType: 'checkboxmodel'
                },
                columns: [{
                    text: i18n.getKey('id'),
                    width: 60,
                    dataIndex: 'id'
    			}, {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 167
    			}, {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 190
    			}],
                bbar: Ext.create('Ext.PagingToolbar', {
                    store: Ext.data.StoreManager.lookup('builderBackgroundClassStore'),
                    displayInfo: true,
                    //displayMsg: 'Displaying {0} - {1} of {2}',
                    emptyMsg: i18n.getKey('noData')
                })
            }
        }, {
            xtype: 'uxfilefield',
            labelAlign: 'right',
            name: 'files',
            onlyImage: true,
            buttonText: i18n.getKey('browser'),
            fieldLabel: i18n.getKey('stuff'),
            buttonConfig: {
                width: 70
            },
            width: 648,
            height: 130,
            itemId: 'file'
        }, {
            xtype: 'textfield',
            name: 'bbgClasses',
            fieldLabel: 'Test',
            hidden: true,
            itemId: 'testItem'
        }],
        bbar: [{
            xtype: 'button',
            iconCls: 'icon_save',
            text: i18n.getKey('submit'),
            handler: function () {
                var form = this.ownerCt.ownerCt;
                var value = form.getComponent('backgroundClassSelect').getSubmitValue();
                if (value.length == 0 || value == null) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('selectCategory'));
                    return;
                }
                var file = form.getComponent('file').getValue();
                if (file == null || file == "") {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('selectPhoto'));
                    return;
                }
                for (var i = 0; i < value.length; i++) {
                    value[i] = value[i].id;
                }
                form.getComponent('testItem').setValue(value);
                console.log(form.getComponent('testItem').getValue());
                //将items转为htmlform
                form.getForm().submit({
                    success: function (form, action) {
                        var response = action.response;
                        if (response.success) {
                            gridStore.loadData(response.data, true);
                            //productFilter.setValue(uploadForm.getComponent('backgroundClassSelect').getSubmitValue());
                            gridStore.loadPage(1);
                            controller.window.close();
                        } else {
                            Ext.Msg.alert('Info', response.message);
                        }
                    }
                });

            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            iconCls: 'icon_delete',
            handler: function () {
                var form = this.ownerCt.ownerCt;
                form.ownerCt.close();
            }
        }]
    });


    controller.window = new Ext.window.Window({
        title: i18n.getKey('upload') + i18n.getKey('stuff'),
        layout: 'border',
        modal : true,
        closeAction: 'destroy',
        width: 700,
        height: 500,
        items: [uploadForm]
    });
    controller.window.show();

}