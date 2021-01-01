import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import './ball.css'

export const Balls = ({ tabs }) => {
  const [list, setList] = useState([])
  const history = useHistory()
  function start() {
    const oDiv = document.getElementById('div1')
    const aLink = oDiv.getElementsByTagName('span')

    let sinA, cosA, sinB, cosB, sinC, cosC
    const degToRad = Math.PI / 180 //degreeToRadian
    const aList = []
    const radius = 200 //半径
    const bDistract = true
    function getPosition() {
      const iLeft = oDiv.offsetWidth / 2
      const iTop = oDiv.offsetHeight / 2
      for (let i = 0; i < aList.length; i++) {
        aLink[i].style.left = aList[i].cx + iLeft - aList[i].offsetWidth / 2 + 'px'
        aLink[i].style.top = aList[i].cy + iTop - aList[i].offsetHeight / 2 + 'px'
        aLink[i].style.fontSize = Math.ceil((12 * aList[i].scale) / 2) + 8 + 'px'
        aLink[i].style.filter = 'alpha(opacity=' + 100 * aList[i].alpha + ')'
        aLink[i].style.opacity = aList[i].alpha
      }
    }

    function setDepth() {
      const aTemp = []
      for (let i = 0; i < aLink.length; i++) {
        aTemp.push(aLink[i])
      }
      aTemp.sort(function(item1, item2) {
        return item2.cz - item1.cz
      })
      for (let i = 0; i < aTemp.length; i++) {
        aTemp[i].style.zIndex = i
      }
    }

    function sineCosine(a, b, c) {
      sinA = Math.sin(a * degToRad)
      cosA = Math.cos(a * degToRad)
      sinB = Math.sin(b * degToRad)
      cosB = Math.cos(b * degToRad)
      sinC = Math.sin(c * degToRad)
      cosC = Math.cos(c * degToRad)
    }

    function setPosition() {
      let phi = 0
      let theta = 0
      const iLength = aList.length
      const aTemp = []
      const oFragment = document.createDocumentFragment()
      for (let i = 0; i < aLink.length; i++) {
        aTemp.push(aLink[i])
      }
      aTemp.sort(function() {
        return Math.random() < 0.5 ? 1 : -1
      })
      for (let i = 0; i < aTemp.length; i++) {
        oFragment.appendChild(aTemp[i])
      }
      oDiv.appendChild(oFragment)
      for (let i = 1; i < iLength + 1; i++) {
        if (bDistract) {
          phi = Math.acos(-1 + (2 * i - 1) / iLength)
          theta = Math.sqrt(iLength * Math.PI) * phi
        } else {
          phi = Math.random() * Math.PI
          theta = Math.random() * (2 * Math.PI)
        }
        aList[i - 1].cx = radius * Math.cos(theta) * Math.sin(phi)
        aList[i - 1].cy = radius * Math.sin(theta) * Math.sin(phi)
        aList[i - 1].cz = radius * Math.cos(phi)
        aLink[i - 1].style.left = aList[i - 1].cx + oDiv.offsetWidth / 2 - aList[i - 1].offsetWidth / 2 + 'px'
        aLink[i - 1].style.top = aList[i - 1].cy + oDiv.offsetHeight / 2 - aList[i - 1].offsetHeight / 2 + 'px'
      }
    }

    let bActive = false
    const iSpeed = 10
    const iSize = 250
    let disX = 0
    let disY = 0
    let lastA = 1
    let lastB = 1
    const d = 300
    function fnStart() {
      let a, b
      if (bActive) {
        a = (-Math.min(Math.max(-disY, -iSize), iSize) / radius) * iSpeed
        b = (Math.min(Math.max(-disX, -iSize), iSize) / radius) * iSpeed
      } else {
        a = lastA * 0.98
        b = lastB * 0.98
      }
      lastA = a
      lastB = b
      if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) return
      const c = 0
      sineCosine(a, b, c)
      for (let i = 0; i < aList.length; i++) {
        const rx1 = aList[i].cx
        const ry1 = aList[i].cy * cosA + aList[i].cz * -sinA
        const rz1 = aList[i].cy * sinA + aList[i].cz * cosA
        const rx2 = rx1 * cosB + rz1 * sinB
        const ry2 = ry1
        const rz2 = rx1 * -sinB + rz1 * cosB
        const rx3 = rx2 * cosC + ry2 * -sinC
        const ry3 = rx2 * sinC + ry2 * cosC
        const rz3 = rz2
        aList[i].cx = rx3
        aList[i].cy = ry3
        aList[i].cz = rz3
        const per = d / (d + rz3)
        aList[i].x = rx3 * per - 2
        aList[i].y = ry3 * per
        aList[i].scale = per
        aList[i].alpha = per
        aList[i].alpha = (aList[i].alpha - 0.6) * (10 / 6)
      }
      getPosition()
      setDepth()
    }

    let oLabel = null
    for (let i = 0; i < aLink.length; i++) {
      oLabel = {}
      oLabel.offsetWidth = aLink[i].offsetWidth
      oLabel.offsetHeight = aLink[i].offsetHeight
      aList.push(oLabel)
    }

    sineCosine(0, 0, 0)
    setPosition()

    // oDiv.onmouseup = function() {
    //   bActive = false
    // }

    oDiv.onmousedown = function() {
      bActive = true
    }

    oDiv.onmousemove = function(ev) {
      const oEvent = ev || window.event
      disX = oEvent.clientX - (oDiv.offsetLeft + oDiv.offsetWidth / 2)
      disY = oEvent.clientY - (oDiv.offsetTop + oDiv.offsetHeight / 2)
      disX /= 10
      disY /= 10
    }

    oDiv.ontouchstart = function() {
      bActive = true
    }

    oDiv.ontouchmove = function(ev) {
      const oEvent = ev || window.event
      disX = oEvent.clientX - (oDiv.offsetLeft + oDiv.offsetWidth / 2)
      disY = oEvent.clientY - (oDiv.offsetTop + oDiv.offsetHeight / 2)
      disX /= 10
      disY /= 10
    }

    setInterval(fnStart, 30)
  }

  useEffect(() => {
    if (list.length !== 0) {
      start()
    }
  }, [list])

  useEffect(() => {
    if (tabs.length !== 0 && list.length === 0) {
      setList(tabs)
    }
  }, [tabs, list])

  return (
    <div id="div1">
      {list.map(item => {
        return (
          <span
            key={item.owner}
            onClick={() => {
              history.push(`/ecircle/${item.owner}`)
            }}
          >
            {item.name}
          </span>
        )
      })}
    </div>
  )
}
