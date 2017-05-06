[Checkout the project on Github](https://github.com/sghall/resonance)

## TickGroup 

The **TickGroup** is a more specialized type of transition group than **NodeGroup**.
It was designed to help create custom animated scales for data visualizations but my have other applications.
The main difference between a **TickGroup** and a **NodeGroup** is that a **TickGroup** treats a scale prop as immutable and updates when the scale changes (rendering each tick as a node) whereas the NodeGroup treats the data prop as immtuable.     
