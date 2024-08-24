def f(x):
  if x <= 8:
    return (x/4) + 4
  elif x <= 12:
    return 12
  else:
    return -((x-12)/8) + 12

def definite_integral(a, b, n):
  dx = (b - a) / n
  integral_sum = 0.5 * (f(a) + f(b))
  for i in range(1, n):
    x = a + i * dx
    integral_sum += f(x)
  return integral_sum * dx

# Set the number of subintervals (increase for better accuracy)
n = 1000

# Calculate the definite integral
result = definite_integral(0, 20, n)

# Print the result
print(result)
