
const updateDom = (data)=>{
    // while (tbody.hasChildNodes())
    //     tbody.removeChild(tbody.firstChild)
    let id = 0
    const tbody = document.getElementById("tbody");


        createEle("tr",tbody,tr=>{
            createEle("td",tr,td=>{
                  

                td.textContent =  ++id
            })
            for (const value in data) {
                createEle("td",tr,td=>{
                  

                    td.textContent =  value
                })
                createEle("td",tr,td=>{
                  

                    td.textContent =  data[value]
                })
            }
            createEle("td",tr,td=>{
                createEle('i',td,i=>{
                    i.className+="fas fa-edit btnedit"
                    i.setAttribute(`data-id`,data.id)
                    i.addEventListener('click',(e)=>editbtn(e,table))
                })
            })
         
        })
    }
const createEle = (tagName,appendTo,fn)=>
{
    const element = document.createElement(tagName);
    if (appendTo) appendTo.appendChild(element)
    if (fn) fn(element)
}


export {
   createEle,updateDom
}