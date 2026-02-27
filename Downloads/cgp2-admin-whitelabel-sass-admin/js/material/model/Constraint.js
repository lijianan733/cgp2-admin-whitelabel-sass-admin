Ext.define('CGP.material.model.Constraint',{
    extend: 'Ext.data.Model',
    fields: [
        {name: 'quantity',type: 'int',useNull: true},
        'clazz',
        {
            name: 'total',
            type: 'int',
            useNull: true
        },
        {
            name: 'numerator',
            type: 'int',
            useNull: true
        },{
            name: 'denominator',
            type: 'int',
            useNull: true
        },{
            name: 'expression',
            type: 'string'
        },{
            name: 'predefineQuantity',
            type: 'int',
            useNull: true
        },{
            name: 'step',
            type: 'int',
            useNull: true
        }
    ]
});