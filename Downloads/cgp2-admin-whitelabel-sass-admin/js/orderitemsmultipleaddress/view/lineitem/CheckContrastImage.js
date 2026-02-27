Ext.define('CGP.orderitemsmultipleaddress.view.lineitem.CheckContrastImage', {
    extend: 'Ext.window.Window',


    modal: true,
    /*bodyStyle: {
     padding: '20px'
     },*/
    maximized: true,
    autoScroll: true,
    defaults: {
        margin: '20px'
    },
    layout: {
        type: 'column'
    },
    customerImageId:null,
    produceImageId:null,
    initComponent: function () {
        var me = this;
        var customerImage = Ext.create('Ext.panel.Panel', {
            id: me.customerImageId,
            width: 750,
            height: 700,
            autoScroll: true,
            bodyStyle: 'border-color:silver;background-color:#ededed;',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            header: {
                style: 'background-color:white;',
                color: 'black',
                border: '0 0 0 0'
            },
            title: '<font color=green>' + '合作商产品预览图' + '</font>',
            items: [
                /*{
                    height: 652,
                    width: 600,
                    xtype: 'image',
                    style: 'cursor: pointer',
                    src: me.comparisonThumbnail,
                    frame: true,
                    listeners: {
                        el: {
                            click: function () {
                                JSImagePreview(me.comparisonThumbnail);
                            }
                        }
                    }

                }*/
            ]
        });
        var partnerImage = new Image();

        partnerImage.src = me.comparisonThumbnail;
        var produceImage = Ext.create('Ext.panel.Panel', {
            id: me.produceImageId,
            width: 750,
            height: 700,
            autoScroll: true,
            bodyStyle: 'border-color:silver;background-color:#ededed;',
            header: {
                style: 'background-color:white;',
                color: 'black',
                border: '0 0 0 0'
            },
            layout: {
                type: 'vbox',
                align: 'center'
            },
            title: '<font color=green>' + 'QP产品预览图' + '</font>',
            items: []
        });
        var qpImage = new Image();
        qpImage.src = me.produceImage;

        me.title = i18n.getKey('contrastImg');
        me.items = [
            customerImage, produceImage
        ];
        me.callParent(arguments);
        me.show();
    }

});
