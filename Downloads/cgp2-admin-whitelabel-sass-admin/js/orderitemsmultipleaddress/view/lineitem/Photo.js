Ext.define('CGP.orderitemsmultipleaddress.view.lineitem.Photo', {
    extend: 'Ext.window.Window',
    alias: 'widget.photos',
    mixins: ['Ext.ux.util.ResourceInit'],


    modal: true,
    previewWidth: 150,
    previewHeight: 150,
    bodyStyle: {
        padding: '20px'
    },

    width: 1100,
    height: 700,
    autoScroll: true,
    defaults: {
        margin: '20px'
    },
    layout: {
        type: 'column'
    },

    initComponent: function () {
        var me = this;


        /*if (Ext.isEmpty(me.projectId)) {
         throw new Error('project id can not be null!');
         }*/

        me.title = i18n.getKey('userStuff');

        me.addField();
        me.callParent(arguments);

        me.show();
        if (Ext.isEmpty(me.photos)) {
            me.close();
            Ext.Msg.alert(i18n.getKey('prompt'), '没有素材图！');
        }
        if (me.photos.length == 0) {
            me.close();
            Ext.Msg.alert(i18n.getKey('prompt'), '没有素材图！');
        }

    },


    initContent: function () {

        var me = this;
        me.loadPhotos();


    },

    addField: function () {

        var me = this;

        var items = [];


        me.photos ? me.photos.forEach(function (photo, index) {

            var imageUrl = photo.url;
            if (Ext.isEmpty(imageUrl)) {
                //图片名存放的属性不同
                imageUrl = imageServer + (photo.name || photo.fileName);
            }
            var previewComp;
            var imageItem;
            if (Ext.Array.contains(['bmp', 'jpg', 'png', 'jpeg'], imageUrl.split('.').pop())) {
                previewComp = {
                    xtype: 'imagecomponent',
                    src: photo.src || imageUrl,
                    autoEl: 'div',
                    id: 'image' + index,
                    imgCls: 'imgAutoSize',
                    width: '100%',
                    style: {
                        cursor: 'pointer',
                        border: '1px solid',
                    },
                    minWidth: me.previewWidth,
                    minHeight: me.previewHeight,
                    listeners: {
                        afterrender: function (view) {
                            Ext.create('Ext.ux.window.ImageViewer', {
                                imageSrc: imageUrl,
                                actionItem: view.el.dom.id,
                                winConfig: {
                                    title: `${i18n.getKey('check')} < ${photo.fileName} > 预览图`
                                },
                                viewerConfig: null,
                            });
                        }
                    }
                };

                imageItem = [
                    previewComp,
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: false,
                        items: [
                            {
                                xtype: 'button',
                                text: i18n.getKey('preview'),
                                //action: 'download',
                                cls: 'a-btn',
                                hidden: true,
                                handler: function () {
                                    var fileUrl = imageUrl;
                                    window.open(fileUrl);
                                }
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('download'),
                                //action: 'download',
                                cls: 'a-btn',
                                hidden: true,
                                handler: function () {
                                    var fileUrl = imageUrl;
                                    var fileName = photo.name || photo.fileName;

                                    const a = document.createElement('a');
                                    a.setAttribute('href', fileUrl);
                                    //a.setAttribute('type','type/subtype');
                                    a.setAttribute('download', fileName);
                                    a.click();

                                }
                            }
                        ]
                    }
                ]
            } else {
                previewComp = {
                    //height: 130,
                    labelAlign: 'top',
                    border: false,
                    fieldLabel: '附件',
                    readOnly: true,
                    labelWidth: 50,
                    width: 198,
                    xtype: 'textarea',
                    value: imageUrl.split('/').pop()
                };
                imageItem = [
                    previewComp,
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: false,
                        items: [
                            {
                                xtype: 'button',
                                text: i18n.getKey('download'),
                                //action: 'download',
                                cls: 'a-btn',
                                handler: function () {
                                    var fileUrl = imageUrl;
                                    window.open(fileUrl);

                                }
                            }
                        ]
                    }
                ]

            }

            var item = {
                border: false,
                width: 200,
                xtype: 'panel',
                height: 200,
                items: imageItem
            };

            items.push(item);
        }) : Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('没有用户素材图!'))

        me.items = items;

    },

    loadPhotos: function (projectId) {

        var me = this;


        /*Ext.Ajax.request({
         method: 'GET',
         async: false,
         url: adminPath + 'api/admin/project/' + me.projectId + '/photos',
         headers: {
         Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
         },
         success: function (resp, operation) {
         var response = Ext.JSON.decode(resp.responseText);
         if (response.success) {
         me.photos = response.data;
         me.addField();
         } else {
         Ext.Msg.alert(i18n.getKey('prompt'), response.data.message);
         }
         },
         failure: function (resp, operation) {
         var response = Ext.JSON.decode(resp.responseText);
         Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
         }
         })*/

    }
})