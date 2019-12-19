## Snowy Fiori

The original idea for this plugin came from [Meli Lauber](https://blogs.sap.com/2019/11/26/surprise-your-users-with-a-true-x-mas-user-experience-let-it-snow).

I just added some CSS tweaks.

A point for improvement is the performance. Everything is calculated on the CPU now. Ideally, the calculations would be done on the GPU instead.

# Class Diagram

```mermaid
classDiagram
    class Component{
        -Flake Flakes[]
        +constructor()
        +destroy()
        +init()
        -render()
    }

    class Flake{
        -int x
        -int y
        -int r
        -int a
        -int aStep
        -int weight
        -float alpha
        -int speed
        +constructor()
        +init(int x, int y)
        -randomBetween( int min, int max, bool round )
        -distanceBetween( Vector vector1, Vector vector2 )
        +update(canvas)
        -_render(canvas)
    }

    class Vector{
        +int x
        +int Y
    }

    Component "1" --> "1..*" Flake : Contains
    Flake -- Vector
```

# Preview

![snowflake](https://gitlab.com/fiddlebe/ui5/plugins/snowflakes/uploads/67185e0ebbd12eba07932e8720202fd6/snowflake.gif)
