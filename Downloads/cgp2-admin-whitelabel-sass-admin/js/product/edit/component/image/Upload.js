/**
 *产品编辑页面 媒体模块的图片上传组件
 */
Ext.Loader.syncRequire(['Ext.ux.form.field.TriggerField', 'Ext.ux.form.field.FileField']);
Ext.define('CGP.product.edit.component.image.Upload', {
    extend: 'Ext.form.Panel',

    requires: [
        'CGP.product.edit.component.image.Submit'
    ],


    border: false,
    width: '100%',
    padding: 10,
    config: {
        id: 'upload-form',
        url: adminPath + 'api/files?access_token='+Ext.util.Cookies.get("token")
    },

    constructor: function (config) {
        var me = this;


        config = config || {};
        config = Ext.apply(me.config, config);
        me.initConfig(config);

        //图片上传成功后的监听器  parm (response,form)
        me.addEvents('afterimageupload');

        me.callParent([config]);

    },
    initComponent: function(){
        var me = this;
        me.items= [{
            xtype: 'uxfilefield',
            labelAlign: 'right',
            name: 'files',
            buttonText: '选择',
            fieldLabel: '上传图片',
            buttonConfig: {
                width: 70
            },
            listeners: {
                change: function (comp, newValue, oldValue) {
                    var previewForm = me.getComponent('previewForm');
                    if (!Ext.isEmpty(newValue)) {
                        previewForm.setVisible(true);
                     }
                    previewForm.removeAll();
                    var unImage = [];
                    var files = this.fileInputEl.dom.files;
                    Ext.Array.each(files, function (item,index) {
                        var reader = new FileReader();
                        //不符合规格的上传图片
                        reader.addEventListener('load', function (evt) {
                            var image = new Image();
                            image.src = evt.target.result;
                            image.onload = function(){
                                /*if(image.width != 1024 || image.height !=768){
                                    unImage.push(item.name);
                                }else{*/
                                    previewForm.add({
                                        xtype: 'image',
                                        //itemId: 'image',
                                        width: 300,
                                        //title: item.name,
                                        height: 200,
                                        style: 'margin:10px',
                                        src: evt.target.result
                                    });
                                //}
                                if(index == files.length-1){
                                    if(!Ext.isEmpty(unImage)){
                                        Ext.Msg.alert('提示','('+unImage.join(',')+')'+'不符合产品图片规格，请上传800X800尺寸的图片');
                                        me.getForm().reset();
                                        previewForm.setVisible(false);
                                        return;
                                    }
                                }
                            };
                        });
                        reader.readAsDataURL(item);
                    });
                },
                validitychange: function(comp,isValid){
                    if(!isValid){
                        var previewForm = me.getComponent('previewForm');
                        previewForm.setVisible(false);
                    }
                }
            },
            width: 580,
            height: 130,
            itemId: 'file'
        }, {
            xtype: 'form',
            header: {
                style: 'background-color:white;',
                color: 'black',
                border: '0 0 0 0'
            },
            title: '<font color=green>' +i18n.getKey('preview')+ '</font>',
            height: 295,
            autoScroll: true,
            itemId: 'previewForm',
            hidden: true,
            layout: {
             type: 'column',
             columns: 5
             },
            bodyStyle: 'border-color:silver;',
            items: [],
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('upload'),
                    handler: function () {
                        var imageForm = this.ownerCt.ownerCt;
                        var form = imageForm.ownerCt;
                        //将items转为htmlform
                        form.getForm().submit({
                            success: function (form, action) {
                                me.fireEvent('afterimageupload', action.response, form);
                                imageForm.setVisible(false);
                            },
                            failure: function () {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('uploadImgFailure') +"!");
                            }
                        });
                    }
                }
            ]
        }];
        me.callParent(arguments);
    }


});