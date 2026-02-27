Ext.define("CGP.partner.mailtemplatefile.MailTemplateFileModel",{
    extend : 'Ext.data.Model',
    autoLoad: true,
    idProperty:'id',

    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/configurations/mailtemplatefilenames',
        reader :{
            type : 'json',
            root : "data"
        }
    },
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull:true
        },
        {name:'name', type: 'string'},
        {name:'description',  type: 'string'},
        {name: 'content', type: 'string'}
    ]


});