
<div align="center">

## Vector Space of Curves

**A visual interface for creating and mixing a special class of parameterized curves**, described by Dongsung Huh and Terrence J. Sejnowski. Under this parameterization, a linear sum of curves yields a visually intuitive mixture, preserving geometric features of the underlying shapes.

[Click here to give it a go.](https://htmlpreview.github.io/?https://github.com/dudyu/vector-space-of-curves/blob/main/gui.html)

&nbsp;
<img src="/doc/readme-resources/mixing.png" width="600px">
&nbsp;

</div>
<div align="left">

### Specifically...
The curves are parameterized as:
<div align="center"> $logr(\theta) = \epsilon sin(\frac{m}{n} \theta - \phi)$ </div>

Where:

- r is the radius of curvature
- &theta; is the winding angle tangent to the curve
- m and n are co-prime integers, indexing the symmetry of the shape (m), and its periodicity relative to the winding angle (n).
- &epsilon; and &phi; are eccentricity and phase parameters.

&nbsp;
### References

- Huh, D. (2015). The vector space of convex curves: How to mix shapes. arXiv preprint arXiv:1506.07515.

- Huh, D., & Sejnowski, T. J. (2015). Spectrum of power laws for curved hand movements. Proceedings of the National Academy of Sciences, 112(29), E3950-E3958.

</div>
